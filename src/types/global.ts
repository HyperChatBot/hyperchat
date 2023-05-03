export interface SvgIconProps {
  width?: number
  height?: number
  className?: string
  pathClassName?: string
  onClick?: () => void
}

export interface OpenAIErrorDetail {
  message: string
  type: string
  code: number
  param: string
}

export interface OpenAIError extends Error {
  error: OpenAIErrorDetail
}

export enum Products {
  ChatCompletion = 'chat',
  TextCompletion = 'text',
  Audio = 'audio',
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
}