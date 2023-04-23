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
import { v4 } from 'uuid'
import useModifyDocument from './useModifyDocument'

const useEmbedding = (
  question: string,
  setQuestion: Dispatch<SetStateAction<string>>,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)

  const currConversationId = useRecoilValue(currConversationIdState)
  const setCurrConversation = useSetRecoilState(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const { modifyDocument } = useModifyDocument(schemaNames[Products.Embedding])

  const createEmbedding = async (prompt: string) => {
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
      const embedding = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: question
      })

      // const content = embedding.data.data.map((val) => val.embedding).join('\n')
      const content = `\`\`\`json \n${JSON.stringify(
        embedding.data,
        null,
        2
      )}\n\`\`\``

      setCurrConversation((prevState) => {
        const currState = produce(prevState, (draft) => {
          if (draft) {
            const messages = draft.messages
            const last = messages[messages.length - 1]
            last.message_id = v4()
            last.answer = content
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

  return { loading, createEmbedding }
}

export default useEmbedding
