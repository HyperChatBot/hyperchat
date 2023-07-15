import { AudioTranscriptionConfiguration } from '../configurations/audioTranscription'
import { AudioTranslationConfiguration } from '../configurations/audioTranslation'
import { ChatConfiguration } from '../configurations/chatCompletion'
import { ImageGenerationConfiguration } from '../configurations/imageGeneration'
import { TextCompletionConfiguration } from '../configurations/textCompletion'
import { Products } from './global'

export interface Message {
  messageId: string
  question: string
  answer: string
  questionTokenCount: number
  answerTokenCount: number
  questionCreatedAt: number
  answerCreatedAt: number
  fileName?: string
}

export interface Conversation {
  conversation_id: string
  summary: string
  avatar: string
  createdAt: number
  updatedAt: number
  product: Products
  messages: Message[]
  configuration:
    | ChatConfiguration
    | ImageGenerationConfiguration
    | AudioTranscriptionConfiguration
    | AudioTranslationConfiguration
    | TextCompletionConfiguration
}

export type EmptyMessageParams = Pick<
  Message,
  'question' | 'questionTokenCount' | 'fileName'
>
