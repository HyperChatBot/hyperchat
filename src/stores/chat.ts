import { atom, selector } from 'recoil'
import { Chat } from 'src/types/chat'

export const chatsState = atom<Chat[]>({
  key: 'chatsState',
  default: []
})

export const currChatIdState = atom<string>({
  key: 'currChatIdState',
  default: ''
})

export const currChatState = selector({
  key: 'currChatState',
  get: ({ get }) => {
    const currId = get(currChatIdState)
    const chats = get(chatsState)

    return chats.find((chat) => chat.chat_id === currId)
  },
  // set: ({ get, set }, newValue) =>
  //   set(chatsState, (prevValue) => {
  //     const chats = get(chatsState)

  //   })
})
