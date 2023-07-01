import Button from '@mui/material/Button'
import Dexie from 'dexie'
import { exportDB, importDB } from 'dexie-export-import'
import { FC, useState } from 'react'

const ImportOrExportDexie: FC = () => {
  const [usage, setUsage] = useState(0)

  const exportDatabase = async () => {
    const database = await new Dexie('hyperchat').open()
    const blob = await exportDB(database)
    return blob
  }

  const importDatabase = async (file: File) => {
    const database = await importDB(file)
    return database.backendDB()
  }

  return (
    <section>
      <Button>Export Data</Button>
      <Button>Import Data</Button>
    </section>
  )
}

export default ImportOrExportDexie
