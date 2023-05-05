import { isAxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { useOpenAI } from 'src/hooks'
import { db } from 'src/models/db'
import { generateEmptyMessage } from 'src/shared/utils'
import {
  currConversationIdState,
  tempMessageState
} from 'src/stores/conversation'
import { OpenAIError } from 'src/types/openai'
import { v4 } from 'uuid'

const useImage = (question: string) => {
  const [loading, setLoading] = useState(false)
  const openai = useOpenAI()
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db.image.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createImage = async () => {
    if (loading) return

    setLoading(true)
    const tempMessage = generateEmptyMessage(question)
    setTempMessage(tempMessage)

    try {
      const image = await openai.createImage({
        prompt: question
      })

      const content = image.data.data
        .map((val, key) => `![${question}-${key}](${val.url})\n`)
        .join('')

      const newMessage = produce(tempMessage, (draft) => {
        draft.answer_created_at = +new Date()
        draft.answer = content
        draft.message_id = v4()
      })

      await db.image.update(currConversationId, {
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

  return { loading, createImage }
}

export default useImage
