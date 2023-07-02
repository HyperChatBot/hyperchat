import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  [Products.OpenAIChat]!: Table<Conversation>;
  [Products.OpenAITextCompletion]!: Table<Conversation>;
  [Products.OpenAIAudioTranscription]!: Table<Conversation>;
  [Products.OpenAIAudioTranslation]!: Table<Conversation>;
  [Products.OpenAIImageGeneration]!: Table<Conversation>;
  [Products.AzureChat]!: Table<Conversation>;
  [Products.AzureTextCompletion]!: Table<Conversation>;
  [Products.AzureImageGeneration]!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      [Products.OpenAIChat]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.OpenAITextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.OpenAIAudioTranscription]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages, *configuration',
      [Products.OpenAIAudioTranslation]:
        '&conversation_id, summary, created_at, updated_at, file_name, *messages, *configuration',
      [Products.OpenAIImageGeneration]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.AzureChat]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.AzureTextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      [Products.AzureImageGeneration]:
        '&conversation_id, summary, created_at, updated_at, *messages, *configuration',
      settings:
        '&&settings_id, company, openai_secret_key, openai_organization_id, openai_author_name, azure_endpoint, azure_secret_key, azure_deployment_name, theme_mode, assistant_avatar_filename'
    })
  }
}

export const db = new HyperChatDB()
