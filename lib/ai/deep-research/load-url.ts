import { customsearch_v1 } from '@googleapis/customsearch'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import * as cheerio from 'cheerio'
import { encodingForModel } from 'js-tiktoken'
import TurndownService from 'turndown'
import { generateChunksByMarkdownTextSplitter } from '../rag'
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
      `Failed to load: **${link}**${e instanceof Error ? ` due to _${e.message}_` : ''}`
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
      `Failed to transform DOM into markdown${e instanceof Error ? ` due to _${e.message}_` : ''}`
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

    sendSse(controller, `Succeed to load PDF from **${link}**`)

    return docs[0].pageContent
  } catch (e) {
    sendSse(
      controller,
      `Failed to load PDF from **${link}**${e instanceof Error ? ` due to _${e.message}_` : ''}`
    )
  }
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
  let tokens = 0
  const chuncks: string[] = []

  async function addToChunks(text: string, link: string, chuncks: string[]) {
    const tokenCount = enc.encode(text).length
    if (tokens + tokenCount <= 200_000) {
      tokens += tokenCount
      const chunk = await generateChunksByMarkdownTextSplitter(text)
      chuncks.push(...chunk)
      visitedUrls.set(link, { chunk, tokenCount })
    } else {
      visitedUrls.set(link, { chunk: [], tokenCount })
      sendSse(
        controller,
        `Discard the document from **${link}** because of too large tokens.`
      )
    }
  }

  for (const { link } of results) {
    if (!link) {
      sendSse(controller, 'Ignore the empty URL.')
      continue
    }

    if (visitedUrls.has(link)) {
      const { chunk, tokenCount } = visitedUrls.get(link) as DocumentData
      if (tokens + tokenCount <= 200_000) {
        chuncks.push(...chunk)
      }

      sendSse(
        controller,
        `Just uses the cache from **${link}** because it has already been parsed from previous research.`
      )

      continue
    }

    const response = await fetch(link)
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/pdf')) {
      const blob = await response.blob()
      const pdf = await loadPdf({ controller, link, blob })

      if (pdf) {
        addToChunks(pdf, link, chuncks)
      }
    } else {
      const html = await response.text()
      const dom = await loadHtmlFromUrl({ controller, link, html })
      if (dom) {
        addToChunks(dom, link, chuncks)
      }
    }
  }

  return chuncks
}
