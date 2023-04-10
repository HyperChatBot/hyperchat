import { atom } from 'recoil'

export const menuState = atom<boolean>({
  key: 'MenuState',
  default: true
})