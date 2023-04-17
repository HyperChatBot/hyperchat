import { produce } from 'immer'
import { atom, DefaultValue, selector } from 'recoil'
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
  set: ({ get, set }, newValue) => {
    set(chatsState, () => {
      const newState = produce(get(chatsState), (draft) => {
        const index = draft.findIndex(
          (chat) => chat.chat_id === get(currChatIdState)
        )

        if (index !== -1 && newValue && !(newValue instanceof DefaultValue)) {
          draft.splice(index, 1, newValue)
        }
      })

      return newState
    })
  }
})

export const scrollToBottomBtnVisibleState = atom({
  key: 'scrollToBottomBtnVisibleState',
  default: false
})

export const summaryInputVisibleState = atom({
  key: 'summaryInputVisibleState',
  default: false
})
