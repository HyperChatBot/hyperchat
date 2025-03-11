import { CallingToolsProps } from '@/types'
import * as cheerio from 'cheerio'
import { z } from 'zod'

export const callingToolName = 'webScraper'

export const toolFn = {
  [callingToolName]: {
    description: 'Useful for retrieving DOM text content from a website.',
    parameters: z.object({ url: z.string().url() }),
    execute: async ({ url }: { url: string }) => {
      try {
        const $ = await cheerio.fromURL(url)

        $('style').remove()
        $('script').remove()

        return $.text()
      } catch {
        console.log("I don't know how to do that.")
      }
    }
  }
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>{'result' in toolInvocation ? <p>{toolInvocation.result}</p> : null}</>
  )
}
