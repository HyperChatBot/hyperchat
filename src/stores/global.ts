import { atom } from 'recoil'
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

export const themeModeState = atom({
  key: 'themeModeState',
  default: ThemeMode.dark
})
