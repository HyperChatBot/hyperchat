import { regularPrompt } from '@/lib/ai/prompts'
import { toolFn as calculator } from '@/lib/ai/tools/calculator'
import { toolFn as getCurrencyRate } from '@/lib/ai/tools/get-currency-rate'
import { toolFn as getDate } from '@/lib/ai/tools/get-date'
import { toolFn as getWeather } from '@/lib/ai/tools/get-weather'
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages
} from '@/lib/db/queries'
import { Setting } from '@/lib/db/schema'
import { getMostRecentUserMessage, sanitizeResponseMessages } from '@/lib/utils'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createDataStreamResponse, streamText, type Message } from 'ai'
import { v4 as uuidV4 } from 'uuid'
import { generateTitleFromUserMessage } from '../../actions'

export const maxDuration = 60

export async function POST(request: Request) {
  const {
    id,
    setting,
    messages
  }: { id: string; messages: Array<Message>; setting: Setting } =
    await request.json()

  const userMessage = getMostRecentUserMessage(messages)

  if (!userMessage) {
    return new Response('No user message found', { status: 400 })
  }
  const chat = await getChatById({ id })
  if (!chat) {
    const title = await generateTitleFromUserMessage({
      message: userMessage,
      setting
    })
    await saveChat({ id, title })
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }]
  })

  const openai = createOpenAI({
    apiKey: setting.openaiApiKey,
    baseURL: setting.openaiBaseUrl,
  })

  const gemini = createGoogleGenerativeAI({
    apiKey: setting.googleApiKey
  })

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        // model: gemini('gemini-2.0-flash-001'),
        model: openai('gpt-4o'),
        system: regularPrompt,
        messages,
        maxSteps: 20,
        experimental_generateMessageId: uuidV4,
        // providerOptions: {
        //   openai: {
        //     reasoningEffort: 'medium'
        //   }
        // },
        tools: {
          ...calculator,
          ...getWeather,
          ...getCurrencyRate,
          ...getDate
        },
        onFinish: async ({ response, reasoning }) => {
          try {
            const sanitizedResponseMessages = sanitizeResponseMessages({
              messages: response.messages,
              reasoning
            })

            await saveMessages({
              messages: sanitizedResponseMessages.map((message) => {
                return {
                  id: message.id,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date()
                }
              })
            })
          } catch {
            console.error('Failed to save chat')
          }
        }
      })

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true
      })
    },
    onError: (e) => {
      return e instanceof Error ? e.message : 'Oops, an error occured!'
    }
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response('Not Found', { status: 404 })
  }

  try {
    await deleteChatById({ id })

    return new Response('Chat deleted', { status: 200 })
  } catch {
    return new Response('An error occurred while processing your request', {
      status: 500
    })
  }
}
