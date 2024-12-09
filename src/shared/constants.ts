import { SnackbarOrigin } from '@mui/material'
import { Functions } from 'src/types/global'

export const EMPTY_CHAT_HINT = 'Create your first conversation!'

export const BAN_ACTIVE_HINT = 'Please wait your request is being processed!'

export const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left'
}

export const SNACKBAR_MAX_NUM = 1

export const SNACKBAR_AUTO_HIDE_DURATION = 3000

export const multiMedialConfig = {
  [Functions.ImageAttachment]: { multiple: true, accept: 'image/*' },
  [Functions.AudioAttachment]: {
    multiple: false,
    accept:
      'audio/mp3,video/mp4,video/mpeg,video/mpea,video/m4a,video/wav,video/webm'
  }
}
