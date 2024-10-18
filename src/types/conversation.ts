import { ChatCompletionContentPart } from 'openai/resources'
import { AudioTranscriptionConfiguration } from '../configurations/audioTranscription'
import { AudioTranslationConfiguration } from '../configurations/audioTranslation'
import { ChatConfiguration } from '../configurations/chatCompletion'
import { CompletionConfiguration } from '../configurations/completion'
import { ImageGenerationConfiguration } from '../configurations/imageGeneration'
import { Products } from './global'

export interface AudioContentPart {
  type: 'audio'
  audioUrl: {
    url: string
  }
  text: string
  binary?: File
}

export enum Roles {
  System = 'system',
  Assistant = 'assistant',
  User = 'user'
}

export interface Message {
  messageId: string
  role: Roles
  content: (ChatCompletionContentPart | AudioContentPart)[]
  tokensCount: number
  createdAt: number
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
    | CompletionConfiguration
}

export interface AudioFile {
  filename: string
  binary?: File
}
