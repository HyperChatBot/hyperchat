export interface Chat {
  chat_id: string
  summary: string
  created_at: number
  updated_at: number
  messages: Message[]
}

export interface Message {
  message_id: string
  question: string
  answer: ''
  created_at: number
}
