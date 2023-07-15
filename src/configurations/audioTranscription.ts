export interface AudioTranscriptionConfiguration {
  model: (typeof models)[number]
  temperature: number
  responseFormat: (typeof responseFormats)[number]
  language: string
}

export const models = ['whisper-1']

export const responseFormats = ['json', 'text', 'srt', 'verbose_json', 'vtt']

export const configuration: AudioTranscriptionConfiguration = {
  model: 'whisper-1',
  temperature: 0,
  responseFormat: 'json',
  language: ''
}
