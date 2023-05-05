import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  [Products.ChatCompletion]!: Table<Conversation>;
  [Products.TextCompletion]!: Table<Conversation>;
  [Products.AudioTranscription]!: Table<Conversation>;
  [Products.AudioTranslation]!: Table<Conversation>;
  [Products.Image]!: Table<Conversation>;
  [Products.Edit]!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      [Products.ChatCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.TextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.AudioTranscription]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages',
      [Products.AudioTranslation]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages',
      [Products.Image]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.Edit]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      settings:
        '&&settings_id, secret_key, organization_id, author_name, theme_mode, assistant_avatar_filename, chat_model, text_completion_model, edit_model, audio_transcription_model, audio_translation_model, audio_response_type, image_generation_type, chat_stream, text_completion_stream'
    })
  }
}

export const db = new HyperChatDB()
