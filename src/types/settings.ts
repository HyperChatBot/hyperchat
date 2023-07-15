import { Companies, ThemeMode } from './global'

export interface Settings {
  settingsId: string
  company: Companies
  openaiSecretKey: string
  openaiOrganizationId: string
  openaiAuthorName: string
  azureSecretKey: string
  azureEndPoint: string
  azureDeploymentName: string
  themeMode: ThemeMode
  assistantAvatarFilename: string
}
