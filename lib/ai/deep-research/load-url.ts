import { customsearch_v1 } from '@googleapis/customsearch'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import chalk from 'chalk'
import * as cheerio from 'cheerio'
import { encodingForModel } from 'js-tiktoken'
import TurndownService from 'turndown'
import { generateChunksByMarkdownTextSplitter } from '../rag'
import { visitedURLs } from './deep-research'

const enc = encodingForModel('o3-mini')

export async function loadHtmlFromUrl(url: string, html: string) {
  try {
    const $ = cheerio.load(html)

    $('style').remove()
    $('script').remove()
    $('head').remove()

    console.log(chalk.greenBright(`Succeed to visit: "${url}"\n`))
    return $.html()
  } catch (e) {
    console.log(
      chalk.redBright(
        `Failed to load: "${url}"${e instanceof Error ? ` due to ${e.message}` : ''}\n`
      )
    )
  }
}

export function domToMarkdown(dom: string) {
  try {
    const turndownService = new TurndownService()
    return turndownService.turndown(dom)
  } catch (e) {
    console.log(
      chalk.redBright(
        `Failed to transform DOM into markdown${e instanceof Error ? ` due to ${e.message}` : ''}\n`
      )
    )
  }
}

export async function loadPdf(url: string, blob: Blob) {
  try {
    const loader = new WebPDFLoader(blob, { parsedItemSeparator: '' })
    const docs = await loader.load()

    console.log(chalk.greenBright(`Succeed to load PDF from "${url}"\n`))

    return docs[0].pageContent
  } catch (e) {
    console.log(
      chalk.redBright(
        `Failed to load PDF from "${url}"${e instanceof Error ? ` due to ${e.message}` : ''}\n`
      )
    )
  }
}

export async function transformDocumentIntoChunks(
  results: customsearch_v1.Schema$Result[]
) {
  let tokens = 0
  const chuncks: string[] = []

  async function addToChunks(text: string, link: string, chuncks: string[]) {
    const tokenCount = enc.encode(text).length
    if (tokens + tokenCount <= 200_000) {
      tokens += tokenCount
      const chunk = await generateChunksByMarkdownTextSplitter(text)
      chuncks.push(...chunk)
      visitedURLs.set(link, chunk)
    } else {
      console.log(
        chalk.yellowBright(
          `Discard the document from "${link}" because of too large tokens.\n`
        )
      )
    }
  }

  for (const { link } of results) {
    if (!link) {
      console.log(chalk.yellowBright(`Ignore the empty URL\n`))
      continue
    }

    if (visitedURLs.has(link)) {
      console.log(
        chalk.yellowBright(
          `"Ignore "${link}" because it has already been used in previous research.\n`
        )
      )
      continue
    }

    const response = await fetch(link)
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/pdf')) {
      const blob = await response.blob()
      const pdf = await loadPdf(link, blob)

      if (pdf) {
        addToChunks(pdf, link, chuncks)
      }
    } else {
      const html = await response.text()
      const dom = await loadHtmlFromUrl(link, html)
      if (dom) {
        addToChunks(dom, link, chuncks)
      }
    }
  }

  return chuncks
}
