import { Companies, ThemeMode } from './global'

export interface Settings {
  id: string
  company: Companies
  openaiApiKey: string
  openaiBaseUrl: string
  openaiOrganizationId: string
  openaiAuthorName: string
  googleSecretKey: string
  anthropicSecretKey: string
  ollamaUrl: string
  themeMode: ThemeMode
  assistantAvatarFilename: string
}
