import { ImageGenerateParams } from 'openai/resources'

export interface ImageGenerationConfiguration {
  n: number
  size: (typeof sizes)[number]
  responseFormat: (typeof responseFormats)[number]
}

export const sizes: ImageGenerateParams['size'][] = [
  '256x256',
  '512x512',
  '1024x1024'
]

export const responseFormats: ImageGenerateParams['response_format'][] = [
  'url',
  'b64_json'
]

export const configuration: ImageGenerationConfiguration = {
  n: 1,
  size: '1024x1024',
  responseFormat: 'url'
}
