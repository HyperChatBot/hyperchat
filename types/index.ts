import { ToolInvocation } from 'ai'

export interface Chat {
  id: string
  createdAt: string
  title: string
}

export interface Message {
  id: string
  chatId: string
  role: string
  content: string
  createdAt: string
  title: string
}

export interface Vote {
  chatId: string
  messageid: string
  isUpvoted: boolean
}

export interface Document {
  id: string
  createdAt: string
  title: string
  content: string
  kind: string
}

export interface Suggestion {
  id: string
  documentId: string
  documentCreatedAt: string
  originalText: string
  suggestedText: string
  createdAt: string
  isResolved: boolean
}

export interface Setting {
  id: string
  openaiApiKey: string
  geminiApiKey: string
  anthropicApiKey: string
}

export interface CallingToolsProps {
  toolInvocation: ToolInvocation
}
