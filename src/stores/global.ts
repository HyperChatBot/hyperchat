import { atom } from 'recoil'

export const onlineState = atom({
  key: 'onlineState',
  default: window.navigator.onLine
})
