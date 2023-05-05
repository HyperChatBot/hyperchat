import { ThemeMode } from './global'

export interface Settings {
  settings_id: string
  secret_key: string
  organization_id: string
  author_name: string
  theme: ThemeMode
  assistant_avatar_filename: string
  chat_model: string
  chat_stream: boolean
  text_completion_model: string
  text_completion_stream: boolean
  edit_model: string
  audio_transcription_model: string
  audio_translation_model: string
  audio_response_type: string
  image_generation_size: string
}
