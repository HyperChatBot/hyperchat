import { useState } from 'react'
import { db } from 'src/db'

const useInsertDocument = <T>(collectionName: string) => {
  const [loading, setLoading] = useState(false)
  const collection = db.collections[collectionName]

  if (!collection) {
    throw new Error('')
  }

  const insertDocument = async (document: T) => {
    setLoading(true)
    try {
      const res: T = await collection.insert(document)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    insertDocument
  }
}

export default useInsertDocument
