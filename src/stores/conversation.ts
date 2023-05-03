import { atom } from 'recoil'
import { Message } from 'src/types/conversation'

export const currConversationIdState = atom<string>({
  key: 'currConversationIdState',
  default: ''
})

export const scrollToBottomBtnVisibleState = atom({
  key: 'scrollToBottomBtnVisibleState',
  default: false
})

export const summaryInputVisibleState = atom({
  key: 'summaryInputVisibleState',
  default: false
})

export const tempMessageState = atom<Message | null>({
  key: 'tempMessageState',
  default: null
})

export const currPlayingAudioIdState = atom<string | null>({
  key: 'currPlayingAudioIdState',
  default: null
})
