import { atom } from 'recoil'
import { Settings } from 'src/types/settings'

export const modalVisibleState = atom({
  key: 'modalVisibleState',
  default: false
})

export const settingsInfoState = atom<Settings>({
  key: 'settingsInfoState',
  default: {
    assistantAvatar: '',
    userAvatar: '',
    apiKey: '',
    orgId: ''
  }
})
