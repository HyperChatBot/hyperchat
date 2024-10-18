import Dexie, { Table } from 'dexie'
import { Conversation } from 'src/types/conversation'
import { Settings } from 'src/types/settings'

export class HyperChatDB extends Dexie {
  conversations!: Table<Conversation>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      conversations:
        '&conversationId, summary, fileName, product, createdAt, updatedAt, *messages, *configuration',
      settings:
        '&&settingsId, company, openaiSecretKey, openaiOrganizationId, openaiAuthorName, azureEndPoint, azureSecretKey, azureDeploymentNameChatCompletion, azureDeploymentNameCompletion, azureDeploymentNameSpeechRecognition, azureDeploymentNameTextToImage, azureDeploymentNameEmbedding, azureDeploymentNameAudioGeneration, azureSpeechSecretKey, azureSpeechRegion, themeMode, assistantAvatarFilename'
    })
  }
}
export const db = new HyperChatDB()
