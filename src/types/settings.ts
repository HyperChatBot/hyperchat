import { Companies, ThemeMode } from './global'

export interface Settings {
  settings_id: string
  company: Companies
  openai_secret_key: string
  openai_organization_id: string
  openai_author_name: string
  azure_secret_key: string
  azure_endpoint: string
  azure_deployment_name: string
  theme_mode: ThemeMode
  assistant_avatar_filename: string
}
