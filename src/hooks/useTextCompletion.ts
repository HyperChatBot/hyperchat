import { isAxiosError } from 'axios'
import produce from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { openai } from 'src/openai'
import { EMPTY_MESSAGE_ID, schemaNames } from 'src/shared/constants'
import {
  currConversationIdState,
  currConversationState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { OpenAIError, Products } from 'src/types/global'
import useModifyDocument from './useModifyDocument'

const useTextCompletion = (
  question: string,
  setQuestion: Dispatch<SetStateAction<string>>,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)

  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const { modifyDocument } = useModifyDocument(
    schemaNames[Products.TextCompletion]
  )

  const createTextCompletion = async () => {
    if (summaryInputVisible) return
    if (loading) return
    if (question.trim().length === 0) return

    setLoading(true)

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

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: question
      })

      const { id, choices } = completion.data

      setCurrConversation((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            const messages = draft.messages
            const last = messages[messages.length - 1]
            last.message_id = id
            last.answer = choices[0].text || ''
            last.answer_created_at = +new Date()
          }
        })

        modifyDocument(
          {
            // @ts-ignore
            conversation_id: currConversationId
          },
          {
            messages: currState?.messages
          }
        )

        return currState
      })

      showScrollToBottomBtn()
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        console.log(error.response?.status) // Eg: 404
        console.log(error.response?.data) //  OpenAIError
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, createTextCompletion }
}

export default useTextCompletion
