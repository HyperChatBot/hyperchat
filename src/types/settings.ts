import { Companies, ThemeMode } from './global'

export interface Settings {
  settingsId: string
  company: Companies
  openaiSecretKey: string
  openaiOrganizationId: string
  openaiAuthorName: string
  azureSecretKey: string
  azureEndPoint: string
  azureDeploymentNameChatCompletion: string
  azureDeploymentNameCompletion: string
  azureDeploymentNameSpeechRecognition: string
  azureDeploymentNameTextToImage: string
  azureDeploymentNameEmbedding: string
  azureDeploymentNameAudioGeneration: string
  themeMode: ThemeMode
  assistantAvatarFilename: string
}
