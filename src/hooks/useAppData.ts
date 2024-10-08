import { convertFileSrc } from '@tauri-apps/api/core'
import { appDataDir, join } from '@tauri-apps/api/path'
import { BaseDirectory, exists, mkdir, writeFile } from '@tauri-apps/plugin-fs'
import { generateHashName } from 'src/shared/utils'

const useAppData = () => {
  const transformFilenameToSrc = async (fileName: string) => {
    try {
      const isExist = await exists(`data/${fileName}`, {
        baseDir: BaseDirectory.AppData
      })

      if (isExist) {
        const appDataDirPath = await appDataDir()
        const filePath = await join(appDataDirPath, `data/${fileName}`)
        const assetUrl = convertFileSrc(filePath)

        return assetUrl
      } else {
        throw new Error('')
      }
    } catch {
      throw new Error('')
    }
  }

  const saveFileToAppDataDir = async (file: File) => {
    const hashName = generateHashName(file.name)
    await mkdir('data', { baseDir: BaseDirectory.AppData, recursive: true })
    await writeFile(`data/${hashName}`, await file.arrayBuffer() as Uint8Array, {
      baseDir: BaseDirectory.AppData
    })
    return hashName
  }

  return { transformFilenameToSrc, saveFileToAppDataDir }
}

export default useAppData
