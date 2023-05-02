export interface Message {
  message_id: string
  question: string
  answer: string
  file_path?: string
  question_created_at: number
  answer_created_at: number
}

export interface Conversation {
  conversation_id: string
  summary: string
  created_at: number
  updated_at: number
  messages: Message[]
}
