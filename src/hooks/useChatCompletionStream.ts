import { isAxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { db } from 'src/models/db'
import { OPENAI_API_KEY, OPENAI_CHAT_COMPLTION_URL } from 'src/shared/constants'
import {
  generateEmptyMessage,
  generateErrorMessage,
  updateMessageState
} from 'src/shared/utils'
import {
  currConversationIdState,
  tempMessageState
} from 'src/stores/conversation'
import { OpenAIChatResponse } from 'src/types/chatCompletion'
import { Message } from 'src/types/conversation'
import { ErrorType, OpenAIError } from 'src/types/global'

const useConversationCompletionStream = (
  question: string,
  clearTextarea: () => void
) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db.chat.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createChatCompletion = async () => {
    if (isStreaming) return

    setIsStreaming(true)
    clearTextarea()
    // Append an empty message object to show loading spin.
    setTempMessage(generateEmptyMessage(question))

    const chat = await fetch(OPENAI_CHAT_COMPLTION_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: OPENAI_API_KEY
      },
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: question
          }
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
        user: currConversationId
      })
    })

    const reader = chat.body?.getReader()

    if (!reader) {
      toast.error(
        generateErrorMessage(ErrorType.Unknown, 'Cannot read ReadableStream.')
      )
      return
    }

    if (chat.status !== 200) {
      toast.error(generateErrorMessage(ErrorType.OpenAI, chat.statusText))
      return
    }

    let _currMessage: Message | null = null

    const decoder = new TextDecoder('utf-8')
    try {
      const read = async (): Promise<any> => {
        const { done, value } = await reader.read()

        if (done) {
          setIsStreaming(false)

          if (_currMessage) {
            await db.chat.update(currConversationId, {
              messages: currConversation
                ? [...currConversation.messages, _currMessage]
                : [_currMessage]
            })
          }

          return reader.releaseLock()
        }

        const chunk = decoder.decode(value, { stream: true })
        const chunks: OpenAIChatResponse[] = chunk
          .split('data:')
          .map((data) => {
            const trimData = data.trim()
            if (trimData === '') return undefined
            if (trimData === '[DONE]') return undefined
            return JSON.parse(data.trim())
          })
          .filter((data) => data)

        chunks.forEach((data) => {
          const token = data.choices[0].delta.content

          if (token !== undefined) {
            setTempMessage((prevState) => {
              const currState = produce(prevState, (draft) => {
                if (draft) {
                  updateMessageState(draft, data.id, token, true)
                }
              })

              _currMessage = currState
              return currState
            })
          }
        })

        return read()
      }

      await read()
    } catch (error) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        toast.error(error.response?.data.error.message || '')
      }
    } finally {
      setTempMessage(null)
    }

    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useConversationCompletionStream
