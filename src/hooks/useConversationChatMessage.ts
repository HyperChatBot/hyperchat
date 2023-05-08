import produce from 'immer'
import { useRecoilState, useRecoilValue } from 'recoil'
import { db } from 'src/models/db'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import {
  Conversation,
  EmptyMessageParams,
  Message
} from 'src/types/conversation'
import { v4 } from 'uuid'

const generateEmptyMessage = (params: EmptyMessageParams): Message => ({
  message_id: v4(),
  answer: '',
  question_created_at: +new Date(),
  answer_created_at: +new Date(),
  ...params
})

const useConversationChatMessage = () => {
  const currProduct = useRecoilValue(currProductState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )

  const pushEmptyMessage = (params: EmptyMessageParams) => {
    const emptyMessage = generateEmptyMessage(params)
    setCurrConversation({
      ...(currConversation as Conversation),
      messages: [...(currConversation as Conversation).messages, emptyMessage]
    })

    return emptyMessage
  }

  const updateStreamState = (token: string) => {
    let content = ''
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (!draft) return

        const last = draft.messages[draft.messages.length - 1]
        last.answer += token
      })

      content += token
      return currState
    })

    return content
  }

  const saveMessageToDbAndUpdateConversationState = async (
    emptyMessage: Message,
    answer: string
  ) => {
    const conversation = await db[currProduct].get(
      (currConversation as Conversation).conversation_id
    )

    if (conversation) {
      conversation.messages.push({
        ...emptyMessage,
        answer_created_at: +new Date(),
        answer
      })
      conversation.updated_at = +new Date()

      await db[currProduct].update(
        (currConversation as Conversation).conversation_id,
        conversation
      )
      setCurrConversation(conversation)
    }
  }

  return {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState
  }
}

export default useConversationChatMessage
