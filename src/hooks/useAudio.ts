import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs'
import { isAxiosError } from 'axios'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { db } from 'src/models/db'
import { openai } from 'src/openai'
import { generateEmptyMessage, updateMessageState } from 'src/shared/utils'
import {
  currConversationIdState,
  currConversationState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { errorAlertState } from 'src/stores/global'
import { OpenAIError } from 'src/types/global'
import { v4 } from 'uuid'
import { getFileExtension } from 'yancey-js-util'

const useAudio = (
  question: string,
  clearTextarea: () => void,
  file: File | null,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)

  const createTranscription = async () => {
    if (summaryInputVisible) return
    if (loading) return
    if (!file) return

    setLoading(true)

    const extensionName = getFileExtension(file.name)
    const fileName = v4() + '.' + extensionName
    await writeBinaryFile(fileName, await file.arrayBuffer(), {
      dir: BaseDirectory.Download
    })

    // Append an empty message object to show loading spin.
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (draft) {
          draft.messages.push(generateEmptyMessage(question))
        }
      })

      return currState
    })

    clearTextarea()

    try {
      const transcription = await openai.createTranscription(
        file,
        'whisper-1',
        question
      )

      setCurrConversation((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            updateMessageState(draft, v4(), transcription.data.text)
          }
        })

        db.audio.update(currConversationId, {
          messages: currState?.messages
        })

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

      setCurrConversation((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            draft.messages.pop()
          }
        })

        return currState
      })
    } finally {
      setLoading(false)
    }
  }

  return { loading, createTranscription }
}

export default useAudio
