import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { MangoQuerySelector } from 'rxdb'
import { useCollection } from 'src/hooks'
import { schemaNames } from 'src/shared/constants'
import { generateErrorMessage } from 'src/shared/utils'
import { currPruductState, errorAlertState } from 'src/stores/global'
import { ErrorType } from 'src/types/global'

const useModifyDocument = <T>() => {
  const [loading, setLoading] = useState(false)
  const currPruduct = useRecoilValue(currPruductState)
  const conversationCollection = useCollection(schemaNames[currPruduct])
  const setErrorAlertState = useSetRecoilState(errorAlertState)

  const modifyDocument = async (
    selector: MangoQuerySelector<T>,
    newData: object
  ) => {
    setLoading(true)
    try {
      const document = await conversationCollection
        .findOne({
          selector
        })
        .exec()

      if (document) {
        await document.patch({ ...newData, updated_at: +new Date() })
      } else {
        throw new Error(
          `Cannot to find the document in the "${schemaNames[currPruduct]}" collection.`
        )
      }
    } catch (e) {
      setErrorAlertState({
        code: 500,
        message: generateErrorMessage(
          ErrorType.RxDB,
          e instanceof Error
            ? e.message
            : `Failed to modify document in the "${schemaNames[currPruduct]}" collection.`
        )
      })
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
