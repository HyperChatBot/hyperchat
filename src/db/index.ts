import Dexie, { Table } from 'dexie'
import { Configuration, Conversation } from 'src/types/conversation'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  conversations!: Table<Conversation>
  configurations!: Table<Configuration>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      conversations:
        '&id, summary, fileName, company, createdAt, updatedAt, *messages',
      configurations:
        '&company, model, systemMessage, maxResponse, temperature, topP, *stop, frequencyPenalty, presencePenalty, systemMessageTokensCount',
      settings:
        '&id, company, openaiSecretKey, openaiOrganizationId, openaiAuthorName, geminiSecretKey, anthropicSecretKey, themeMode, assistantAvatarFilename'
    })
  }
}
export const db = new HyperChatDB()
