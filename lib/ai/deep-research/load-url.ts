import { customsearch_v1 } from '@googleapis/customsearch'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { generateChunksByMarkdownTextSplitter } from '../rag'

export function extractMetaInUrl($: cheerio.CheerioAPI, url: string) {
  const title = $('title').text()
  const iconHref = $('link[rel="icon"]').attr('href')
  const iconLink = iconHref ? new URL(iconHref, url).href : null
  const { hostname } = new URL(url)

  return {
    title,
    iconLink,
    hostname,
    url
  }
}

export async function loadHtmlFromUrl(url: string) {
  try {
    const $ = await cheerio.fromURL(url)
    const meta = extractMetaInUrl($, url)

    $('style').remove()
    $('script').remove()

    return { htmlStr: $.html(), meta }
  } catch (e) {
    console.log(e)
  }
}

export function htmlToMarkdown(htmlStr: string) {
  const turndownService = new TurndownService()
  return turndownService.turndown(htmlStr)
}

export async function transformSerpToChunks(
  results: customsearch_v1.Schema$Result[]
) {
  const chuncks = []

  for (const result of results) {
    if (!result.link) continue

    const document = await loadHtmlFromUrl(result.link)
    if (!document) continue

    const { htmlStr, meta } = document
    const chunk = await generateChunksByMarkdownTextSplitter(
      htmlToMarkdown(htmlStr)
    )
    chuncks.push(...chunk)
  }

  return chuncks
}
