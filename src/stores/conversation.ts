import { atom } from 'recoil'
import { Base64FilePrompt, Conversation } from 'src/types/conversation'

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

export const inputTextState = atom({
  key: 'InputText',
  default: ''
})

export const base64FilePromptState = atom<Base64FilePrompt[]>({
  key: 'Base64FilePrompt',
  default: []
})
