import { useState } from 'react'
import { MangoQuerySelector } from 'rxdb'
import { db } from 'src/db'

const useModifyDocument = <T>(collectionName: string) => {
  const [loading, setLoading] = useState(false)
  const collection = db.collections[collectionName]

  if (!collection) {
    throw new Error('')
  }

  const modifyDocument = async (
    selector: MangoQuerySelector<T>,
    newData: object
  ) => {
    setLoading(true)
    try {
      const document = await collection
        .findOne({
          selector
        })
        .exec()

      if (document) {
        await document.patch({ ...newData, updated_at: +new Date() })
      }
    } catch {
      // TODO:
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    modifyDocument
  }
}

export default useModifyDocument
