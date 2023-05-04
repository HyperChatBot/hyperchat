import { isAxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { db } from 'src/models/db'
import { openai } from 'src/openai'
import { generateEmptyMessage } from 'src/shared/utils'
import {
  currConversationIdState,
  tempMessageState
} from 'src/stores/conversation'
import { HashFile } from 'src/types/global'
import { OpenAIError } from 'src/types/openai'
import { v4 } from 'uuid'

const useAudioTranscription = (
  question: string,
  clearTextarea: () => void,
  hashFile: HashFile | null
) => {
  const [loading, setLoading] = useState(false)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db.audio_transcription.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createTranscription = async () => {
    if (loading) return
    if (!hashFile) return

    setLoading(true)
    const tempMessage = {
      ...generateEmptyMessage(question),
      file_name: hashFile.hashName
    }
    setTempMessage(tempMessage)
    clearTextarea()

    try {
      const transcription = await openai.createTranscription(
        hashFile.file,
        'whisper-1',
        question
      )

      const newMessage = produce(tempMessage, (draft) => {
        draft.answer_created_at = +new Date()
        draft.answer = transcription.data.text
        draft.message_id = v4()
      })

      await db.audio_transcription.update(currConversationId, {
        messages: currConversation
          ? [...currConversation.messages, newMessage]
          : [newMessage]
      })
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        toast.error(error.response?.data.error.message || '')
      }
    } finally {
      setTempMessage(null)
      setLoading(false)
    }
  }

  return { loading, createTranscription }
}

export default useAudioTranscription
