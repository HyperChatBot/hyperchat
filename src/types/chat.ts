export interface Chat {
  chat_id: string
  summary: string
  created_at?: number
  updated_at?: number
  messages: Message[]
}

export interface Message {
  message_id: string
  question: string
  answer: string
  created_at: number
}

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
