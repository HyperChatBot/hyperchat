import { isAxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { db } from 'src/models/db'
import { openai } from 'src/openai'
import { generateEmptyMessage, updateMessageState } from 'src/shared/utils'
import {
  currConversationIdState,
  summaryInputVisibleState,
  tempMessageState
} from 'src/stores/conversation'
import { errorAlertState } from 'src/stores/global'
import { OpenAIError } from 'src/types/global'
import { v4 } from 'uuid'

const useAudio = (
  question: string,
  clearTextarea: () => void,
  file: File | null,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const currConversation = useLiveQuery(
    () => db.audio.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createTranscription = async () => {
    if (summaryInputVisible) return
    if (loading) return
    if (!file) return

    setLoading(true)
    setTempMessage(generateEmptyMessage(question))
    clearTextarea()

    try {
      const transcription = await openai.createTranscription(
        file,
        'whisper-1',
        question
      )

      setTempMessage((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            updateMessageState(draft, v4(), transcription.data.text)
          }
        })

        if (currState) {
          db.audio.update(currConversationId, {
            messages: currConversation
              ? [...currConversation.messages, currState]
              : [currState]
          })
        }

        return currState
      })

      showScrollToBottomBtn()
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        setErrorAlertState({
          code: error.response?.status || 0,
          message: error.response?.data.error.message || ''
        })
      }
    } finally {
      setTempMessage(null)
      setLoading(false)
    }
  }

  return { loading, createTranscription }
}

export default useAudio
