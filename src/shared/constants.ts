import { SnackbarOrigin } from '@mui/material'
import { CreateImageRequestSizeEnum } from 'openai'

export const OPENAI_BASE_URL = 'https://api.openai.com/v1'

export const OPENAI_CHAT_COMPLETION_URL = OPENAI_BASE_URL + '/chat/completions'

export const EMPTY_CHAT_HINT = 'Create your first conversation!'

export const TEXTAREA_MAX_ROWS = 8

export const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left'
}

export const SNACKBAR_MAX_NUM = 1

export const SNACKBAR_AUTO_HIDE_DURATION = 3000

export const textCompletions = [
  'text-davinci-003',
  'text-davinci-002',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001'
]

export const chatCompletions = ['gpt-3.5-turbo', 'gpt-4']

export const audios = ['whisper-1']

export const audioResponseTypes = ['json', 'text', 'srt', 'verbose_json', 'vtt']

export const imageSizes: CreateImageRequestSizeEnum[] = [
  '1024x1024',
  '256x256',
  '512x512'
]
