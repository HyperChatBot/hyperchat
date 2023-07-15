export interface ChatConfiguration {
  model: (typeof models)[number]['name']
  systemMessage: string
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  stop: string[]
  system_message_tokens_count: number
}

export const models = [
  {
    name: 'gpt-3.5-turbo',
    tokensLimit: 4 * 2 ** 10 + 1
  },
  {
    name: 'gpt-3.5-turbo-16k',
    tokensLimit: 16 * 2 ** 10 + 1
  },
  {
    name: 'gpt-4',
    tokensLimit: 8 * 2 ** 10 + 1
  },
  {
    name: 'gpt-4-32k',
    tokensLimit: 32 * 2 ** 10 + 1
  }
] as const

export const configuration: ChatConfiguration = {
  model: 'gpt-3.5-turbo',
  systemMessage: 'You are an AI assistant that helps people find information.',
  maxTokens: 800,
  temperature: 0.7,
  topP: 0.95,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stop: [],
  system_message_tokens_count: 11
}
