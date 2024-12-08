import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { generateFilename } from 'src/shared/utils'

export interface Request {
  file: File
}

export interface Response {
  success: boolean
  filename: string
  error?: string
}

const saveFileToAppDataDir = async (
  event: Electron.IpcMainInvokeEvent,
  { file }: Request
): Promise<Response> => {
  const filename = generateFilename(file.name)

  if (!existsSync(filename)) {
    mkdirSync(filename, { recursive: true })
  }

  writeFileSync(
    `data/${filename}`,
    (await file.arrayBuffer()) as Uint8Array,
    'utf8'
  )

  return { success: true, filename }
}

export default saveFileToAppDataDir
