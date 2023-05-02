import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'

export class HyperChatDB extends Dexie {
  [Products.ChatCompletion]!: Table<Conversation>;
  [Products.TextCompletion]!: Table<Conversation>;
  [Products.Audio]!: Table<Conversation>;
  [Products.Image]!: Table<Conversation>

  constructor() {
    super('hyperchat2')
    this.version(1).stores({
      [Products.ChatCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.TextCompletion]:
        '&conversation_id, summary, created_at, updated_at, *messages',
      [Products.Audio]:
        '&conversation_id, summary, created_at, updated_at, type, file_path, *messages',
      [Products.Image]:
        '&conversation_id, summary, created_at, updated_at, *messages'
    })
  }
}

export const db = new HyperChatDB()
