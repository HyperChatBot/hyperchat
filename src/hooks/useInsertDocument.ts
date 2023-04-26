import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { db } from 'src/db'
import { generateErrorMessage } from 'src/shared/utils'
import { errorAlertState } from 'src/stores/global'
import { ErrorType } from 'src/types/global'

const useInsertDocument = <T>(collectionName: string) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const collection = db.collections[collectionName]

  if (!collection) {
    throw new Error('')
  }

  const insertDocument = async (document: T) => {
    setLoading(true)
    try {
      await collection.insert({
        ...document,
        created_at: +new Date(),
        updated_at: +new Date()
      })
    } catch {
      setErrorAlertState({
        code: 500,
        message: generateErrorMessage(
          ErrorType.RxDB,
          `Failed to insert document into the "${collectionName}" collection.`
        )
      })
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
