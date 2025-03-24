import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import 'dotenv/config'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
})

export const o3MiniModel = openai('o3-mini', {
  structuredOutputs: true,
  reasoningEffort: 'medium'
})

const gemini = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL
})

export const gemini2FlashThinkingModel = gemini(
  'gemini-2.0-flash-thinking-exp-01-21',
  {
    structuredOutputs: true
  }
)
