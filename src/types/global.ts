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
  ChatCompletion,
  TextCompletion,
  Embedding,
  Audio,
  Moderation,
  Image
}
