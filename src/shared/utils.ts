import { isAxiosError } from 'axios'
import { DateTime } from 'luxon'
import toast from 'src/components/Snackbar'
import { Companies, ErrorType, Products, ThemeMode } from 'src/types/global'
import { OpenAIError } from 'src/types/openai'
import { Settings } from 'src/types/settings'
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

  return { isSameDay: false, display: date.toLocaleString(DateTime.DATE_FULL) }
}

export const generateErrorMessage = (type: ErrorType, message: string) =>
  type + message

export const generateHashName = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const hashName = `${v4()}_${+new Date()}.${extension}`

  return hashName
}

export const isOpenAIAudioProduct = (product: Products) =>
  product === Products.OpenAIAudioTranscription ||
  product === Products.OpenAIAudioTranslation

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

export const showErrorToast = (error: unknown) => {
  if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
    toast.error(error.response?.data.error.message || '')
  }
}

export const checkApiKey = (settings: Settings) => {
  const unregisters = []
  if (!settings.openai_secret_key) {
    unregisters.push(Companies.OpenAI)
  }

  if (!settings.azure_endpoint && !settings.azure_secret_key) {
    unregisters.push(Companies.Azure)
  }

  return unregisters
}

export const snakeCaseToTitleCase = (s: string) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : ' ' + d.toUpperCase()
  )
