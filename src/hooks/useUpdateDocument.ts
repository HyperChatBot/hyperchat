import { useState } from 'react'
import { MangoQuerySelector } from 'rxdb'
import { db } from 'src/db'

const useUpdateDocument = <T>(collectionName: string) => {
  const [loading, setLoading] = useState(false)
  const collection = db.collections[collectionName]

  if (!collection) {
    throw new Error('')
  }

  const updateDocument = async (
    selector: MangoQuerySelector<any>,
    updateFn: (oldData: T) => T
  ) => {
    setLoading(true)
    try {
      const document = await collection
        .findOne({
          selector
        })
        .exec()

      if (document) {
        await document.modify(updateFn)
      }
    } catch {
      // TODO:
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    updateDocument
  }
}

export default useUpdateDocument
