import { AudioTranscriptionConfiguration } from './audioTranscription'

export type AudioTranslationConfiguration = Omit<
  AudioTranscriptionConfiguration,
  'language'
>

export const configuration: AudioTranslationConfiguration = {
  model: 'whisper-1',
  temperature: 0,
  response_format: 'json'
}
