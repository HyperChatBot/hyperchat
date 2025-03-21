import { customsearch } from '@googleapis/customsearch'
import { sendSse } from './sse'

export async function searchWeb({
  controller,
  query,
  limit = 5
}: {
  controller: ReadableStreamDefaultController
  query: string
  limit?: number
}) {
  try {
    const result = await customsearch('v1').cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_CSE_ID,
      q: query,
      num: limit,
      lr: 'lang_en'
    })

    sendSse(
      controller,
      `Search results from Google: \n\`\`\`json\n${JSON.stringify(
        result.data.items?.map((item) => ({
          title: item.title,
          link: item.link
        })),
        null,
        2
      )}`
    )

    return result.data.items
  } catch (error) {
    sendSse(
      controller,
      `Failed to search "${query}" from Google${error instanceof Error ? ` due to *${error.message}*` : ''}`
    )
  }
}
