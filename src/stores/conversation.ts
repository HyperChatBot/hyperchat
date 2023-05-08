import { atom } from 'recoil'
import { Conversation } from 'src/types/conversation'

export const currConversationState = atom<Conversation | undefined>({
  key: 'currConversationState',
  default: undefined
})

export const summaryInputVisibleState = atom({
  key: 'summaryInputVisibleState',
  default: false
})

export const avatarPickerVisibleState = atom({
  key: 'avatarPickerVisibleState',
  default: false
})

export const currPlayingAudioIdState = atom<string | null>({
  key: 'currPlayingAudioIdState',
  default: null
})

export const loadingState = atom({
  key: 'loadingState',
  default: false
})
