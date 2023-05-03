import Dexie,{ Table } from 'dexie';
import { Conversation } from 'src/types/conversation';
import { Products } from 'src/types/global';

export class HyperChatDB extends Dexie {
  [Products.ChatCompletion]!: Table<Conversation>;
  [Products.TextCompletion]!: Table<Conversation>;
  [Products.AudioTranscription]!: Table<Conversation>;
  [Products.AudioTranslation]!: Table<Conversation>;
  [Products.Image]!: Table<Conversation>;
  [Products.Moderation]!: Table<Conversation>
  [Products.Edit]!: Table<Conversation>

  constructor() {
    super('hyperchat')
    // Update version when create a table
    this.version(2).stores({
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
        '&conversation_id, summary, created_at, updated_at, *messages'
    })
  }
}

export const db = new HyperChatDB()
