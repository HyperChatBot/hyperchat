export interface OpenAIChatDelta {
  role?: string
  content?: string
}

export interface OpenAIChatChoice {
  delta: OpenAIChatDelta
  index: number
  finish_reason: string | null
}

export interface OpenAIChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAIChatChoice[]
}

export interface OpenAIErrorDetail {
  message: string
  type: string
  code: number
  param: string
}

export interface OpenAIError extends Error {
  error: OpenAIErrorDetail
}
