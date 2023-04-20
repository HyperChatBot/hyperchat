import { Products } from 'src/types/global'

export const EMPTY_MESSAGE_ID = '$$EMPTY_MESSAGE_ID'

export const OPENAI_BASE_URL = 'https://api.openai.com/v1'

export const OPENAI_CHAT_COMPLTION_URL = OPENAI_BASE_URL + '/chat/completions'

export const OPENAI_API_KEY = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`

export const EMPTY_CHAT_HINT = 'Create your first conversation!'

export const conversationTitles = {
  [Products.ChatCompletion]: 'Chat Completion',
  [Products.Embedding]: 'Embeddings',
  [Products.TextCompletion]: 'Text Completion'
}

export const schemaNames = {
  [Products.ChatCompletion]: 'chat',
  [Products.Embedding]: 'embedding',
  [Products.TextCompletion]: 'text'
}
