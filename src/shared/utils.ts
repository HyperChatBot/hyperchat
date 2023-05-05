import {
  BaseDirectory,
  createDir,
  exists,
  writeBinaryFile
} from '@tauri-apps/api/fs'
import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { WritableDraft } from 'immer/dist/internal'
import { DateTime } from 'luxon'
import { Message } from 'src/types/conversation'
import { ErrorType, HashFile, Products, ThemeMode } from 'src/types/global'
import { v4 } from 'uuid'
import { getFileExtension } from 'yancey-js-util'
import { EMPTY_MESSAGE_ID } from './constants'

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

export const generateEmptyMessage = (question: string) => ({
  message_id: EMPTY_MESSAGE_ID,
  answer: '',
  question,
  question_created_at: +new Date(),
  answer_created_at: +new Date()
})

export const updateMessageState = (
  draft: WritableDraft<Message>,
  id: string,
  answer: string,
  stream?: boolean
) => {
  const isFirstChuck = draft.message_id === EMPTY_MESSAGE_ID
  if (isFirstChuck) {
    draft.message_id = id
  }

  if (stream) {
    draft.answer += answer
  } else {
    draft.answer = answer
  }

  draft.answer_created_at = +new Date()
}

export const generateHashName = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const hashName = `${v4()}_${+new Date()}.${extension}`

  return hashName
}

export const saveFileToAppDataDir = async (hashFile: HashFile) => {
  try {
    await createDir('data', { dir: BaseDirectory.AppData, recursive: true })
    await writeBinaryFile(
      `data/${hashFile.hashName}`,
      await hashFile.file.arrayBuffer(),
      {
        dir: BaseDirectory.AppData
      }
    )
  } catch {}
}

export const generateFileSrc = async (fileName: string) => {
  try {
    const isExist = await exists(`data/${fileName}`, {
      dir: BaseDirectory.AppData
    })

    if (isExist) {
      const appDataDirPath = await appDataDir()
      const filePath = await join(appDataDirPath, `data/${fileName}`)
      const assetUrl = convertFileSrc(filePath)

      return assetUrl
    } else {
      throw new Error('')
    }
  } catch {}
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
