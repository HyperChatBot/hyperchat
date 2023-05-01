import { atom } from 'recoil'
import { AlertError, Products } from 'src/types/global'

export const onlineState = atom({
  key: 'onlineState',
  default: window.navigator.onLine
})

export const currProductState = atom({
  key: 'currProductState',
  default: Products.ChatCompletion
})

export const errorAlertState = atom<AlertError | false>({
  key: 'errorAlertState',
  default: false
})
