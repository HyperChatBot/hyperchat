export interface ImageGenerationConfiguration {
  n: number
  size: (typeof sizes)[number]
  response_format: (typeof responseFormats)[number]
}

export const sizes = ['256x256', '512x512', '1024x1024']

export const responseFormats = ['url', 'b64_json']

export const configuration: ImageGenerationConfiguration = {
  n: 1,
  size: '1024x1024',
  response_format: 'url'
}
