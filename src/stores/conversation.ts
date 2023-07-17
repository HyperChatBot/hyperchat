import { atom } from 'recoil'
import { Conversation } from 'src/types/conversation'

export const currConversationState = atom<Conversation | undefined>({
  key: 'CurrConversation',
  default: undefined
})

export const summaryInputVisibleState = atom({
  key: 'SummaryInputVisible',
  default: false
})

export const avatarPickerVisibleState = atom({
  key: 'AvatarPickerVisible',
  default: false
})

export const currPlayingAudioIdState = atom<string | undefined>({
  key: 'CurrPlayingAudioId',
  default: undefined
})

export const loadingState = atom({
  key: 'Loading',
  default: false
})
