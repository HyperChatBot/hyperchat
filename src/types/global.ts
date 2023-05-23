export interface SvgIconProps {
  width?: number
  height?: number
  className?: string
  pathClassName?: string
  onClick?: () => void
}

export enum Products {
  ChatCompletion = 'chat',
  TextCompletion = 'text',
  AudioTranscription = 'audio_transcription',
  AudioTranslation = 'audio_translation',
  Image = 'image'
}

export interface AlertError {
  code: number
  message: string
}

export enum ErrorType {
  OpenAI = '[OpenAI] ',
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
