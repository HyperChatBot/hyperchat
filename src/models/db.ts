import Dexie, { Table } from 'dexie'
import { AudioConversation, Conversation } from 'src/types/conversation'

export class HyperChatDB extends Dexie {
  chat!: Table<Conversation>
  text!: Table<Conversation>
  audio!: Table<AudioConversation>
  image!: Table<Conversation>

  constructor() {
    super('hyperchat2')
    this.version(1).stores({
      chat: '&conversation_id, summary, created_at, updated_at, *messages',
      text: '&conversation_id, summary, created_at, updated_at, *messages',
      audio:
        '&conversation_id, summary, created_at, updated_at, type, file_path, *messages',
      image: '&conversation_id, summary, created_at, updated_at, *messages'
    })
  }
}

export const db = new HyperChatDB()
