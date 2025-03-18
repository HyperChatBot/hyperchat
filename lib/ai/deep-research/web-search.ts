import { customsearch } from '@googleapis/customsearch'

export async function searchWeb(query: string, limit = 5) {
  const result = await customsearch('v1').cse.list({
    auth: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CSE_ID,
    q: query,
    num: limit,
    lr: 'lang_en'
  })

  return result.data.items
}
