import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import Button from '@mui/material/Button'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import Dexie from 'dexie'
import { exportDB, importDB } from 'dexie-export-import'
import { ChangeEvent, FC, useRef } from 'react'
import toast from '../Snackbar'

const ImportOrExportDexie: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const exportDatabase = async () => {
    try {
      const database = await new Dexie('hyperchat').open()
      const blob = await exportDB(database)
      const text = await blob.text()
      const filename = `dexie-export-${Date.now()}.json`
      await writeTextFile(filename, text, {
        dir: BaseDirectory.Download
      })

      toast.success(
        `The ${filename} has been saved in your local Download Directory.`
      )
    } catch {}
  }

  const importDatabase = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    try {
      await importDB(file)
      window.location.reload()
    } catch (e: unknown) {
      toast.error(e.message)
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <section className="flex gap-2">
      <Button
        variant="outlined"
        onClick={exportDatabase}
        startIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
      >
        Export Data
      </Button>
      <Button
        variant="outlined"
        startIcon={<DocumentArrowUpIcon className="h-4 w-4" />}
        className="relative"
      >
        <input
          ref={inputRef}
          type="file"
          accept="*.json"
          className="absolute left-0 top-0 h-full w-full opacity-0"
          onChange={(e) => importDatabase(e)}
        />
        Import Data
      </Button>
    </section>
  )
}

export default ImportOrExportDexie
