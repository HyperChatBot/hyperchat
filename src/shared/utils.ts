import { encodingForModel, TiktokenModel } from 'js-tiktoken'
import { DateTime } from 'luxon'
import toast from 'src/components/Snackbar'
import { Products, ThemeMode } from 'src/types/global'
import { v4 } from 'uuid'
import { getFileExtension } from 'yancey-js-util'

export const formatDate = (millis: number) => {
  const now = DateTime.now()
  const date = DateTime.fromMillis(millis)

  if (now.hasSame(date, 'day')) {
    return {
      isSameDay: true,
      display: date.toLocaleString(DateTime.TIME_24_SIMPLE)
    }
  }

  return { isSameDay: false, display: date.toLocaleString(DateTime.DATE_MED) }
}

export const generateHashName = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const hashName = `${v4()}_${+new Date()}.${extension}`

  return hashName
}

export const isAudioProduct = (product: Products) =>
  product === Products.AudioTranscription ||
  product === Products.AudioTranslation

export const formatBytes = (bytes: number) => {
  const k = 1024
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB'
  ]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const themeModeToTheme = (themeMode?: ThemeMode) =>
  themeMode === ThemeMode.system || !themeMode
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.dark
      : ThemeMode.light
    : themeMode

export const getTokensCount = (content: string, model: TiktokenModel) =>
  encodingForModel(model).encode(content).length

// Output a simple error if request failed.
// TODO: Output the error message thrown by the OpenAI or Azure API.
export const showApiRequestErrorToast = () => toast.error(`Request failed.`)
