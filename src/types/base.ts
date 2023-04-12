export interface SvgIconProps {
  className?: string
}

export interface OpenAIErrorDetail {
  message: string;
  type: string;
  code: number;
  param: string
}

export interface OpenAIError {
  error: OpenAIErrorDetail
}