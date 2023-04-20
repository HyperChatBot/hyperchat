import { produce } from 'immer'
import { atom, DefaultValue, selector } from 'recoil'
import { Conversation } from 'src/types/conversation'

export const conversationsState = atom<Conversation[]>({
  key: 'conversationsState',
  default: []
})

export const currConversationIdState = atom<string>({
  key: 'currConversationIdState',
  default: ''
})

export const currConversationState = selector({
  key: 'currConversationState',
  get: ({ get }) => {
    const currId = get(currConversationIdState)
    const conversations = get(conversationsState)

    return conversations.find(
      (conversation) => conversation.conversation_id === currId
    )
  },
  set: ({ get, set }, newValue) => {
    set(conversationsState, () => {
      const newState = produce(get(conversationsState), (draft) => {
        const index = draft.findIndex(
          (conversation) =>
            conversation.conversation_id === get(currConversationIdState)
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
