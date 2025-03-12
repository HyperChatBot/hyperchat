// Bring Your Own Browser (BYOB)

import { CallingToolsProps } from '@/types'
import * as cheerio from 'cheerio'
import { search, SearchOptions } from 'duck-duck-scrape'
import { z } from 'zod'

export const callingToolName = 'searchOnline'

async function webScraper({ url }: { url: string }) {
  try {
    const $ = await cheerio.fromURL(url)

    $('style').remove()
    $('script').remove()

    return $.text()
  } catch {
    console.log("I don't know how to do that.")
  }
}

export const toolFn = {
  [callingToolName]: {
    description:
      'A search engine. Useful for when you need to answer questions about current events. Input should be a search query.',
    parameters: z.object({ query: z.string() }),
    execute: async ({ query }: { query: string }) => {
      const searchOptions: SearchOptions = {}

      const { results } = await search(query, searchOptions)
      const data = JSON.stringify(
        results.map((result) => ({
          title: result.title,
          link: result.url,
          snippet: result.description
        }))
      )

      return data
    }
  }
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>{'result' in toolInvocation ? <p>{toolInvocation.result}</p> : null}</>
  )
}
