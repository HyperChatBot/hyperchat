import { customsearch_v1 } from '@googleapis/customsearch'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import chalk from 'chalk'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { generateChunksByMarkdownTextSplitter } from '../rag'

export async function loadHtmlFromUrl(url: string) {
  try {
    const res = await fetch(url, {})
    const html = await res.text()
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

export async function loadPdf(url: string) {
  try {
    const result = await fetch(url)
    const blob = await result.blob()
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

export async function transformDocumentToChunks(
  results: customsearch_v1.Schema$Result[]
) {
  const chuncks: string[] = []

  for (const { link } of results) {
    if (!link) continue

    if (link.includes('.pdf')) {
      const pdf = await loadPdf(link)

      if (pdf) {
        const chunk = await generateChunksByMarkdownTextSplitter(pdf)
        chuncks.push(...chunk)
      }
    } else {
      const dom = await loadHtmlFromUrl(link)

      if (dom) {
        const markdown = domToMarkdown(dom)

        if (markdown) {
          const chunk = await generateChunksByMarkdownTextSplitter(markdown)
          chuncks.push(...chunk)
        }
      }
    }
  }

  return chuncks
}
