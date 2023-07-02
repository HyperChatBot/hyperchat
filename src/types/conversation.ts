import { AudioTranscriptionConfiguration } from '../configurations/audioTranscription'
import { AudioTranslationConfiguration } from '../configurations/audioTranslation'
import { ChatConfiguration } from '../configurations/chat'
import { ImageGenerationConfiguration } from '../configurations/imageGeneration'
import { TextCompletionConfiguration } from '../configurations/textCompletion'

export interface Message {
  message_id: string
  question: string
  answer: string
  question_created_at: number
  answer_created_at: number
  file_name?: string
}

export interface Conversation {
  conversation_id: string
  summary: string
  avatar: string
  created_at: number
  updated_at: number
  messages: Message[]
  configuration:
    | ChatConfiguration
    | ImageGenerationConfiguration
    | AudioTranscriptionConfiguration
    | AudioTranslationConfiguration
    | TextCompletionConfiguration
}

export type EmptyMessageParams = Pick<Message, 'question' | 'file_name'>
