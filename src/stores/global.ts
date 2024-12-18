import { atom } from 'recoil'
import { themeModeToTheme } from 'src/shared/utils'
import { ThemeMode } from 'src/types/global'

export const onlineState = atom({
  key: 'OnlineState',
  default: window.navigator.onLine
})

export const themeState = atom<ThemeMode.dark | ThemeMode.light>({
  key: 'Theme',
  default: themeModeToTheme()
})

export const configurationDrawerVisibleState = atom({
  key: 'ConfigurationDrawerVisible',
  default: false
})
