import { AudioTranscriptionConfiguration } from '../configurations/audioTranscription'
import { AudioTranslationConfiguration } from '../configurations/audioTranslation'
import { ChatConfiguration } from '../configurations/chatCompletion'
import { ImageGenerationConfiguration } from '../configurations/imageGeneration'
import { TextCompletionConfiguration } from '../configurations/textCompletion'
import { Products } from './global'

export enum Roles {
  System = 'system',
  Assistant = 'assistant',
  User = 'user'
}

export interface Message {
  messageId: string
  content: string
  role: Roles
  tokensCount: number
  createdAt: number
  fileName?: string
}

export interface Conversation {
  conversationId: string
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
  'content' | 'tokensCount' | 'role' | 'fileName'
>
