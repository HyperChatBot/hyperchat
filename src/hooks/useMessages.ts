import { produce } from 'immer'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useDB } from 'src/hooks'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import {
  Conversation,
  EmptyMessageParams,
  Message
} from 'src/types/conversation'
import { v4 } from 'uuid'

const generateEmptyMessage = (params: EmptyMessageParams): Message => ({
  messageId: v4(),
  createdAt: +new Date(),
  ...params
})

const useMessages = () => {
  const currProduct = useRecoilValue(currProductState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )
  const { getOneById, updateOneById } = useDB('conversations')

  const pushEmptyMessage = (params: EmptyMessageParams) => {
    const emptyMessage = generateEmptyMessage(params)
    setCurrConversation({
      ...(currConversation as Conversation),
      messages: [...(currConversation as Conversation).messages, emptyMessage]
    })

    return emptyMessage
  }

  const rollBackEmptyMessage = () => {
    setCurrConversation((prevState) =>
      produce(prevState, (draft) => {
        draft?.messages.pop()
      })
    )
  }

  const updateStreamState = (token: string) => {
    let content = ''
    setCurrConversation((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (!draft) return

        const last = draft.messages[draft.messages.length - 1]
        last.content += token
      })

      content += token
      return currState
    })

    return content
  }

  const saveMessageToDbAndUpdateConversationState = async (
    emptyMessage: Message,
    content: string
  ) => {
    const conversation = await getOneById<Conversation>(
      (currConversation as Conversation).conversationId
    )

    if (conversation) {
      conversation.messages.push({
        ...emptyMessage,
        createdAt: +new Date(),
        content
      })
      conversation.updatedAt = +new Date()

      await updateOneById(
        (currConversation as Conversation).conversationId,
        conversation
      )
      setCurrConversation(conversation)
    }
  }

  return {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState,
    rollBackEmptyMessage
  }
}

export default useMessages
