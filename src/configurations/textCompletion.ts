export interface ResponseText {
  checked: boolean
  content: string
}

export interface TextCompletionConfiguration {
  model: (typeof models)[number]
  max_response: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  pre_response_text: ResponseText
  post_response_text: ResponseText
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
  max_response: 800,
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: [],
  pre_response_text: {
    checked: false,
    content: ''
  },
  post_response_text: {
    checked: false,
    content: ''
  }
}
