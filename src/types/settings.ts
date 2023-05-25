import { CreateImageRequestSizeEnum } from 'openai'
import { ThemeMode } from './global'

export interface Settings {
  settings_id: string
  openai_secret_key: string
  openai_organization_id: string
  openai_author_name: string
  azure_secret_key: string
  azure_endpoint: string
  azure_deployment_name: string
  anthropic_secret_key: string
  theme_mode: ThemeMode
  assistant_avatar_filename: string
  chat_model: string
  chat_stream: boolean
  text_completion_model: string
  text_completion_stream: boolean
  audio_transcription_model: string
  audio_translation_model: string
  audio_response_type: string
  image_generation_size: CreateImageRequestSizeEnum
}
