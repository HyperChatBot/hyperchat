import produce from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  EMPTY_MESSAGE_ID,
  OPENAI_API_KEY,
  OPENAI_CHAT_COMPLTION_URL,
  schemaNames
} from 'src/shared/constants'
import {
  currConversationIdState,
  currConversationState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { OpenAIChatResponse } from 'src/types/chatCompletion'
import { Conversation } from 'src/types/conversation'
import { Products } from 'src/types/global'
import useModifyDocument from './useModifyDocument'

const useConversationCompletionStream = (
  question: string,
  setQuestion: Dispatch<SetStateAction<string>>,
  showScrollToBottomBtn: () => void
) => {
  const [isStreaming, setIsStreaming] = useState(false)

  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const { modifyDocument } = useModifyDocument(
    schemaNames[Products.ChatCompletion]
  )

  const createChatCompletion = async () => {
    if (summaryInputVisible) return
    if (isStreaming) return
    if (question.trim().length === 0) return

    setIsStreaming(true)

    // Append an empty message object to show loading spin.
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (draft) {
          draft.messages.push({
            message_id: EMPTY_MESSAGE_ID,
            answer: '',
            question,
            question_created_at: +new Date(),
            answer_created_at: +new Date()
          })
        }
      })

      return currState
    })

    setQuestion('')

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

    if (chat.status !== 200 || !reader) {
      return 'error'
    }

    let _currConversation: Conversation | undefined = undefined

    const decoder = new TextDecoder('utf-8')
    try {
      const read = async (): Promise<any> => {
        const { done, value } = await reader.read()

        if (done) {
          setIsStreaming(false)
          showScrollToBottomBtn()

          if (_currConversation) {
            modifyDocument(
              {
                // @ts-ignore
                conversation_id: currConversationId
              },
              {
                messages: _currConversation.messages
              }
            )
          }

          return reader.releaseLock()
        }

        const chunk = decoder.decode(value, { stream: true })
        const jsons: OpenAIChatResponse[] = chunk
          .split('data:')
          .map((data) => {
            const trimData = data.trim()
            if (trimData === '') return undefined
            if (trimData === '[DONE]') return undefined
            return JSON.parse(data.trim())
          })
          .filter((data) => data)

        jsons.forEach((json) => {
          const token = json.choices[0].delta.content

          if (token !== undefined) {
            setCurrConversation((prevState) => {
              const currState = produce(prevState, (draft) => {
                if (draft) {
                  const messages = draft.messages
                  const last = messages[messages.length - 1]
                  const isFirstChuck = last.message_id === EMPTY_MESSAGE_ID

                  if (isFirstChuck) {
                    last.message_id = json.id
                  }

                  last.answer += token
                  last.answer_created_at = +new Date()
                }
              })

              _currConversation = currState
              return currState
            })
          }
        })

        return read()
      }

      await read()
    } catch (e) {
      console.error(e)
    }

    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useConversationCompletionStream
