import {
  BaseDirectory,
  createDir,
  exists,
  writeBinaryFile
} from '@tauri-apps/api/fs'
import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { generateHashName } from 'src/shared/utils'

const useAppData = () => {
  const transformFilenameToSrc = async (fileName: string) => {
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

  const saveFileToAppDataDir = async (file: File) => {
    const hashName = generateHashName(file.name)
    await createDir('data', { dir: BaseDirectory.AppData, recursive: true })
    await writeBinaryFile(`data/${hashName}`, await file.arrayBuffer(), {
      dir: BaseDirectory.AppData
    })
    return hashName
  }

  return { transformFilenameToSrc, saveFileToAppDataDir }
}

export default useAppData
