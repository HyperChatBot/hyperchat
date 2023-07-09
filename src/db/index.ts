import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  [Products.ChatCompletion]!: Table<Conversation>;
  [Products.TextCompletion]!: Table<Conversation>;
  [Products.AudioTranscription]!: Table<Conversation>;
  [Products.AudioTranslation]!: Table<Conversation>;
  [Products.ImageGeneration]!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      [Products.ChatCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.TextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.AudioTranscription]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages, *configuration',
      [Products.AudioTranslation]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages, *configuration',
      [Products.ImageGeneration]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      settings:
        '&&settings_id, company, openai_secret_key, openai_organization_id, openai_author_name, azure_endpoint, azure_secret_key, azure_deployment_name, theme_mode, assistant_avatar_filename'
    })
  }
}

export const db = new HyperChatDB()
