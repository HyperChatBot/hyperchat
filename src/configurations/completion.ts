export interface ResponseText {
  checked: boolean
  content: string
}

export interface CompletionConfiguration {
  model: (typeof models)[number]
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  stop: string[]
  preResponse: ResponseText
  postResponse: ResponseText
}

export const models = [
  'text-davinci-003',
  'text-davinci-002',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001'
] as const

export const configuration: CompletionConfiguration = {
  model: 'text-davinci-003',
  maxTokens: 800,
  temperature: 0.7,
  topP: 0.95,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stop: [],
  preResponse: {
    checked: false,
    content: ''
  },
  postResponse: {
    checked: false,
    content: ''
  }
}
