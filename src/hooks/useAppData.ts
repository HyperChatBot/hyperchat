import { convertFileSrc } from '@tauri-apps/api/core'
import { appDataDir, join } from '@tauri-apps/api/path'
import { BaseDirectory, exists, mkdir, writeFile } from '@tauri-apps/plugin-fs'
import { generateFilename } from 'src/shared/utils'

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
    const filename = generateFilename(file.name)
    await mkdir('data', { baseDir: BaseDirectory.AppData, recursive: true })
    await writeFile(
      `data/${filename}`,
      (await file.arrayBuffer()) as Uint8Array,
      {
        baseDir: BaseDirectory.AppData
      }
    )
    return filename
  }

  return { transformFilenameToSrc, saveFileToAppDataDir }
}

export default useAppData
