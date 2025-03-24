import { customsearch_v1 } from '@googleapis/customsearch'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import * as cheerio from 'cheerio'
import { encodingForModel } from 'js-tiktoken'
import TurndownService from 'turndown'
import { CONTEXT_LIMIT } from './constants'
import { sendSse } from './sse'
import { DocumentData } from './types'

const enc = encodingForModel('o3-mini')

export async function loadHtmlFromUrl({
  controller,
  link,
  html
}: {
  controller: ReadableStreamDefaultController
  link: string
  html: string
}) {
  try {
    const $ = cheerio.load(html)

    $('style').remove()
    $('script').remove()
    $('head').remove()

    sendSse(controller, `Succeed to visit: **${link}**`)
    return $.html()
  } catch (e) {
    sendSse(
      controller,
      `Failed to load: **${link}**${e instanceof Error ? ` due to *${e.message}*` : ''}`
    )
  }
}

export function domToMarkdown({
  controller,
  dom
}: {
  controller: ReadableStreamDefaultController
  dom: string
}) {
  try {
    const turndownService = new TurndownService()
    return turndownService.turndown(dom)
  } catch (e) {
    sendSse(
      controller,
      `Failed to transform DOM into markdown${e instanceof Error ? ` due to *${e.message}*` : ''}`
    )
  }
}

export async function loadPdf({
  controller,
  link,
  blob
}: {
  controller: ReadableStreamDefaultController
  link: string
  blob: Blob
}) {
  try {
    const loader = new WebPDFLoader(blob, { parsedItemSeparator: '' })
    const docs = await loader.load()
    sendSse(controller, `Succeed to load PDF from: **${link}**`)
    return docs.reduce((acc, val) => acc + `\n${val.pageContent}`, '')
  } catch (e) {
    sendSse(
      controller,
      `Failed to load PDF from **${link}**${e instanceof Error ? ` due to *${e.message}*` : ''}`
    )
  }
}

async function loadDocument({
  controller,
  link,
  visitedUrls
}: {
  controller: ReadableStreamDefaultController
  link: string
  visitedUrls: Map<string, DocumentData>
}) {
  try {
    const response = await fetch(link)
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/pdf')) {
      const blob = await response.blob()
      const pdf = await loadPdf({ controller, link, blob })
      if (pdf) {
        const documentData = {
          document: pdf,
          tokenCount: enc.encode(pdf).length
        }
        visitedUrls.set(link, documentData)
        return documentData
      }
    } else {
      const html = await response.text()
      const dom = await loadHtmlFromUrl({ controller, link, html })
      if (dom) {
        const markdown = domToMarkdown({ controller, dom })
        if (markdown) {
          const documentData = {
            document: markdown,
            tokenCount: enc.encode(markdown).length
          }
          visitedUrls.set(link, documentData)
          return documentData
        }
      }
    }
  } catch (e) {
    sendSse(
      controller,
      `Failed to load **${link}**${e instanceof Error ? ` *${e.message}*` : ''}`
    )
  }
}

function splitStringEvenly(str: string, n: number) {
  const parts: DocumentData[] = []
  const chunkSize = Math.ceil(str.length / n)

  for (let i = 0; i < str.length; i += chunkSize) {
    const part = str.substring(i, i + chunkSize)
    parts.push({
      document: part,
      tokenCount: enc.encode(part).length
    })
  }

  return parts
}

export async function transformDocumentIntoChunks({
  controller,
  results,
  visitedUrls
}: {
  controller: ReadableStreamDefaultController
  results: customsearch_v1.Schema$Result[]
  visitedUrls: Map<string, DocumentData>
}) {
  try {
    const documents: DocumentData[] = []

    const links = results
      .filter((result) => {
        if (!result.link) return false
        if (visitedUrls.has(result.link)) {
          sendSse(
            controller,
            `Ignore to parse **${result.link}** because it has already been researched on previous research.`
          )
          // sendSse(
          //   controller,
          //   `Just uses the cache from **${result.link}** because it has already been parsed on previous research.`
          // )
          // documents.push(visitedUrls.get(result.link) as DocumentData)
          return false
        }
        return true
      })
      .map((result) => result.link as string)

    const newDocuments = await Promise.allSettled(
      links.map((link) => loadDocument({ controller, link, visitedUrls }))
    )
    newDocuments.forEach((newDocument) => {
      if (newDocument.status === 'fulfilled' && newDocument.value) {
        documents.push(newDocument.value)
      }
    })

    const safeDocuments: DocumentData[] = []
    documents.forEach(({ document, tokenCount }) => {
      if (tokenCount < CONTEXT_LIMIT) {
        safeDocuments.push({ document, tokenCount })
      } else {
        const split = Math.ceil(tokenCount / CONTEXT_LIMIT)
        safeDocuments.push(...splitStringEvenly(document, split))
      }
    })

    const result: string[][] = []
    let currentSubarray: string[] = []
    let currentSum = 0
    for (const { tokenCount, document } of safeDocuments) {
      if (currentSum + tokenCount > CONTEXT_LIMIT) {
        result.push([...currentSubarray])
        currentSubarray = [document]
        currentSum = tokenCount
      } else {
        currentSubarray.push(document)
        currentSum += tokenCount
      }
    }

    if (currentSubarray.length > 0) {
      result.push(currentSubarray)
    }

    return result
  } catch (e) {
    sendSse(
      controller,
      `Failed to transform document into chunks${e instanceof Error ? ` *${e.message}*` : ''}`
    )
  }
}
