import { atom } from 'recoil'
import { AudioFile, Conversation } from 'src/types/conversation'

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

export const userInputState = atom({
  key: 'UserInput',
  default: ''
})

export const audioFileState = atom<AudioFile>({
  key: 'AudioFile',
  default: {
    filename: ''
  }
})

export const base64ImagesState = atom<string[] | null>({
  key: 'Base64Images',
  default: null
})
