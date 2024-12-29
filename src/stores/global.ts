import { atom } from 'recoil'
import { themeModeToTheme } from 'src/shared/utils'
import { Configuration } from 'src/types/conversation'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'

export const settingsState = atom<Settings | undefined>({
  key: 'Settings',
  default: undefined
})

export const onlineState = atom({
  key: 'OnlineState',
  default: window.navigator.onLine
})

export const themeState = atom<ThemeMode.dark | ThemeMode.light>({
  key: 'Theme',
  default: themeModeToTheme()
})

export const companyState = atom<Companies>({
  key: 'Company',
  default:
    (window.localStorage.getItem('$$hyperchat-company') as
      | Companies
      | undefined) ?? Companies.OpenAI
})

export const configurationState = atom<Configuration | undefined>({
  key: 'Configuration',
  default: undefined
})

export const loadingState = atom({
  key: 'Loading',
  default: false
})

export const settingsDialogVisibleState = atom({
  key: 'SettingsDialogVisible',
  default: false
})

export const customBotAvatarUrlState = atom({
  key: 'CustomBotAvatarUrl',
  default: ''
})
