import { SnackbarOrigin } from '@mui/material'
import { Products } from 'src/types/global'

export const EMPTY_MESSAGE_ID = '$$EMPTY_MESSAGE_ID'

export const OPENAI_BASE_URL = 'https://api.openai.com/v1'

export const OPENAI_CHAT_COMPLTION_URL = OPENAI_BASE_URL + '/chat/completions'

export const OPENAI_API_KEY = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`

export const EMPTY_CHAT_HINT = 'Create your first conversation!'

export const conversationTitles = {
  [Products.ChatCompletion]: 'Chat Completion',
  [Products.TextCompletion]: 'Text Completion',
  [Products.AudioTranscription]: 'Audio Transcription',
  [Products.AudioTranslation]: 'Audio Translation',
  [Products.Moderation]: 'Moderation',
  [Products.Image]: 'Image Generation',
  [Products.Edit]: 'Edit'
}

export const TEXTAREA_MAX_ROWS = 8

export const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'center'
}

export const SNACKBAR_MAX_NUM = 1

export const SNACKBAR_AUTO_HIDE_DURATION = 3000
