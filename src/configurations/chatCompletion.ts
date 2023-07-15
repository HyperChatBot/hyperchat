export interface ChatConfiguration {
  model: (typeof models)[number]['name']
  system_message: string
  max_tokens: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  system_message_tokens_count: number
}

export const models = [
  {
    name: 'gpt-3.5-turbo',
    maxTokens: 4 * 2 ** 10 + 1
  },
  {
    name: 'gpt-3.5-turbo-16k',
    maxTokens: 16 * 2 ** 10 + 1
  },
  {
    name: 'gpt-4',
    maxTokens: 8 * 2 ** 10 + 1
  },
  {
    name: 'gpt-4-32k',
    maxTokens: 32 * 2 ** 10 + 1
  }
] as const

export const configuration: ChatConfiguration = {
  model: 'gpt-3.5-turbo',
  system_message: 'You are an AI assistant that helps people find information.',
  max_tokens: 800,
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: [],
  system_message_tokens_count: 11
}
