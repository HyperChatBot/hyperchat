import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'

export interface Request {
  filename: string
}

export interface Response {
  success: boolean
  assetUrl?: string
  error?: string
}

const convertFileSrc = (filePath: string) =>
  `file://${filePath.replace(/\\/g, '/')}`

const transformFilenameToSrc = async (
  event: Electron.IpcMainInvokeEvent,
  { filename }: Request
): Promise<Response> => {
  try {
    const isExist = existsSync(`data/${filename}`)

    if (isExist) {
      const appDataDirPath = app.getPath('userData')
      const filePath = join(appDataDirPath, `data/${filename}`)
      const assetUrl = convertFileSrc(filePath)

      return { success: true, assetUrl }
    } else {
      throw new Error('')
    }
  } catch {
    throw new Error('')
  }
}

export default transformFilenameToSrc
