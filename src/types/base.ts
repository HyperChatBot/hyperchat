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

export interface OpenAIError {
  error: OpenAIErrorDetail
}
