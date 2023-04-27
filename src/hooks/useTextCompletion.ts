import { isAxiosError } from 'axios'
import produce from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { openai } from 'src/openai'
import { generateEmptyMessage, updateMessageState } from 'src/shared/utils'
import {
  currConversationIdState,
  currConversationState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { errorAlertState } from 'src/stores/global'
import { OpenAIError } from 'src/types/global'
import useModifyDocument from './useModifyDocument'

const useTextCompletion = (
  question: string,
  setQuestion: Dispatch<SetStateAction<string>>,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const { modifyDocument } = useModifyDocument()

  const createTextCompletion = async () => {
    if (summaryInputVisible) return
    if (loading) return
    if (question.trim().length === 0) return

    setLoading(true)

    // Append an empty message object to show loading spin.
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (draft) {
          draft.messages.push(generateEmptyMessage(question))
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
            updateMessageState(draft, id, choices[0].text || '')
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

  return { loading, createTextCompletion }
}

export default useTextCompletion
