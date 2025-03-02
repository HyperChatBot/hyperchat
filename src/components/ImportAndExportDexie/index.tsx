import Dexie from 'dexie'
import { exportDB, importDB } from 'dexie-export-import'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useRef } from 'react'
import { Button } from 'src/components/ui/button'

const ImportAndExportDexie: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const exportDatabase = async () => {
    try {
      const database = await new Dexie('hyperchat').open()
      const blob = await exportDB(database)
      const text = await blob.text()
      const filename = `dexie-export-${Date.now()}.json`

      window.electronAPI
        .saveFileWithDialog({
          title: `dexie-export-${Date.now()}`,
          filename: `dexie-export-${Date.now()}`,
          extension: 'json',
          text
        })
        .then((res) => {
          if (res.success) {
            enqueueSnackbar(
              `The ${filename} has been saved in your local Download Directory.`,
              { variant: 'success' }
            )
          }
        })
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      enqueueSnackbar(e?.toString(), { variant: 'error' })
    }
  }

  const importDatabase = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    try {
      await importDB(file)
      window.location.reload()
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      enqueueSnackbar(e?.message, { variant: 'error' })
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <section className="flex gap-4">
      <Button variant="outline" type="button" onClick={exportDatabase}>
        Export Data
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => document.getElementById('import-data')?.click()}
      >
        Import Data
      </Button>
      <input
        type="file"
        id="import-data"
        accept="image/*"
        className="hidden"
        onChange={importDatabase}
      />
    </section>
  )
}

export default ImportAndExportDexie
