import { atom } from 'recoil'
import { Products } from 'src/types/global'

export const onlineState = atom({
  key: 'onlineState',
  default: window.navigator.onLine
})

export const currPruductState = atom({
  key: 'currPruductState',
  default: Products.ChatCompletion
})
