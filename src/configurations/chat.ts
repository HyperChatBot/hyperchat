export interface ChatConfiguration {
  model: (typeof models)[number]
  system_message: string
  max_response: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
}

export const models = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-32k'
] as const

export const configuration: ChatConfiguration = {
  model: 'gpt-3.5-turbo',
  system_message: 'You are an AI assistant that helps people find information.',
  max_response: 800,
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0
}
