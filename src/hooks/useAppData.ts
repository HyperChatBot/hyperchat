import { BaseDirectory, createDir, writeBinaryFile } from '@tauri-apps/api/fs'
import { generateFileSrc, generateHashName } from 'src/shared/utils'

const useAppData = () => {
  const transformFilenameToSrc = async (hashName: string) => {
    const fileSrc = await generateFileSrc(hashName)
    return fileSrc
  }

  const saveFileToAppDataDir = async (file: File) => {
    const hashName = generateHashName(file.name)
    await createDir('data', { dir: BaseDirectory.AppData, recursive: true })
    await writeBinaryFile(`data/${hashName}`, await file.arrayBuffer(), {
      dir: BaseDirectory.AppData
    })
    await transformFilenameToSrc(hashName)

    return hashName
  }

  return { transformFilenameToSrc, saveFileToAppDataDir }
}

export default useAppData
