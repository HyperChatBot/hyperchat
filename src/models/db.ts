import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products, ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'
import { v4 } from 'uuid';
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  edits,
  imageSizes,
  moderations,
  textCompletions
} from 'src/openai/models'

export class HyperChatDB extends Dexie {
  [Products.ChatCompletion]!: Table<Conversation>;
  [Products.TextCompletion]!: Table<Conversation>;
  [Products.AudioTranscription]!: Table<Conversation>;
  [Products.AudioTranslation]!: Table<Conversation>;
  [Products.Image]!: Table<Conversation>;
  [Products.Moderation]!: Table<Conversation>;
  [Products.Edit]!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(4).stores({
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
      [Products.Moderation]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.Edit]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      settings:
        '&&settings_id, secret_key, organization_id, author_name, theme, assistant_avatar_filenam, chat_model, text_completion_model, edit_model, audio_transcription_model, audio_translation_model, audio_response_type, image_generation_type, moderation_type, chat_stream, text_completion_stream'
    })
  }

  public async setDefaultSettings () {
    const count = await this.settings.count()

    if (count === 0) {
      await this.settings.add({
        settings_id: v4(),
        secret_key: '',
        organization_id: '',
        author_name: '',
        theme: ThemeMode.system,
        assistant_avatar_filename: '',
        chat_model: chatCompletions[0],
        text_completion_model: textCompletions[0],
        chat_stream: true,
        text_completion_stream: false,
        edit_model: edits[0],
        audio_transcription_model: audios[0],
        audio_translation_model: audios[0],
        audio_response_type: audioResponseTypes[0],
        image_generation_size: imageSizes[0],
        moderation_model: moderations[0]
      })
    }
  }
}

export const db = new HyperChatDB()
