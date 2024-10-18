import { encodingForModel, TiktokenModel } from 'js-tiktoken'
import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'
import { Products, RequestError, ThemeMode } from 'src/types/global'
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

export const generateFilename = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const filename = `${v4()}_${+new Date()}.${extension}`

  return filename
}

export const isSupportAudio = (product: Products) =>
  product === Products.AudioTranscription ||
  product === Products.AudioTranslation ||
  product === Products.ChatCompletion

export const themeModeToTheme = (themeMode?: ThemeMode) =>
  themeMode === ThemeMode.system || !themeMode
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.dark
      : ThemeMode.light
    : themeMode

export const getTokensCount = (content: string, model: TiktokenModel) =>
  encodingForModel(model).encode(content).length

export const showRequestErrorToast = (e?: RequestError | unknown) =>
  enqueueSnackbar(
    (e as RequestError)?.message ??
      (e as RequestError)?.name ??
      'Request failed.',
    {
      variant: 'error'
    }
  )

export const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
