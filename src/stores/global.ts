import { atom } from 'recoil'
import { AlertError, Products } from 'src/types/global'

export const onlineState = atom({
  key: 'onlineState',
  default: window.navigator.onLine
})

export const currPruductState = atom({
  key: 'currPruductState',
  default: Products.ChatCompletion
})

export const errorAlertState = atom<AlertError | false>({
  key: 'errorAlertState',
  default: false
})
