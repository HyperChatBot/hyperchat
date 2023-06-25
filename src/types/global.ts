export interface SvgIconProps {
  width?: number
  height?: number
  className?: string
  pathClassName?: string
  onClick?: () => void
}

export enum Companies {
  OpenAI = 'OpenAI',
  Azure = 'Azure'
}

export enum Products {
  OpenAIChat = 'openai_chat',
  OpenAITextCompletion = 'openai_text_completion',
  OpenAIAudioTranscription = 'openai_audio_transcription',
  OpenAIAudioTranslation = 'openai_audio_translation',
  OpenAIImageGeneration = 'openai_image_generation',
  AzureChat = 'azure_chat',
  AzureTextCompletion = 'azure_text_completion',
  AzureImageGeneration = 'azure_image_generation'
}

export interface AlertError {
  code: number
  message: string
}

export enum ErrorType {
  OpenAI = '[OpenAI] ',
  Azure = '[Azure] ',
  Unknown = '[Unknown] '
}

export interface HashFile {
  file: File
  hashName: string
  src?: string
}

export interface EmojiPickerProps {
  emoticons: string[]
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
}

export enum ThemeMode {
  light = 'light',
  system = 'system',
  dark = 'dark'
}
