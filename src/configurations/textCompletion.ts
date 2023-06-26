export interface TextCompletionConfiguration {
  model: (typeof models)[number]
  system_message: string
  max_response: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
}

export const models = [
  'text-davinci-003',
  'text-davinci-002',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001'
] as const

export const configuration: TextCompletionConfiguration = {
  model: 'text-davinci-003',
  system_message: 'You are an AI assistant that helps people find information.',
  max_response: 800,
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0
}
