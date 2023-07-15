import { atom } from 'recoil'
import { themeModeToTheme } from 'src/shared/utils'
import { Products, ThemeMode } from 'src/types/global'

export const onlineState = atom({
  key: 'onlineState',
  default: window.navigator.onLine
})

export const currProductState = atom({
  key: 'currProductState',
  default:
    (window.localStorage.getItem('currProductState') as Products) ||
    Products.ChatCompletion
})

export const themeState = atom<ThemeMode.dark | ThemeMode.light>({
  key: 'themeState',
  default: themeModeToTheme()
})

export const configurationDrawerVisibleState = atom({
  key: 'configurationDrawerVisibleState',
  default: false
})
