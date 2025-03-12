'use server'

import { Setting } from '@/lib/db/schema'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Message } from 'ai'

export async function generateTitleFromUserMessage({
  message,
  setting
}: {
  setting: Setting
  message: Message
}) {
  const openai = createOpenAI({
    apiKey: setting.openaiApiKey,
    baseURL: setting.openaiBaseUrl
  })

  const gemini = createGoogleGenerativeAI({
    apiKey: setting.googleApiKey
  })

  const { text: title } = await generateText({
    model: gemini('gemini-2.0-flash-001'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message)
  })

  return title
}
