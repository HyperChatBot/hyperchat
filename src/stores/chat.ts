import { atom } from 'recoil'
import { Chat } from 'src/types/chat'

export const chatState = atom<Chat[] | null>({
  key: 'chatState',
  default: null
})

export const chatListState = atom({
  key: 'chatList',
  default: null
})

export const currChatState = atom<string>({
  key: 'currChatState',
  default: ''
})
