import { atom } from 'recoil'
import { Settings } from 'src/types/settings'

export const settingsState = atom<Settings | undefined>({
  key: 'Settings',
  default: undefined
})
