import { produce } from 'immer'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ChatConfiguration } from 'src/configurations/chatCompletion'
import { useDB } from 'src/hooks'
import { getTokensCount } from 'src/shared/utils'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import {
  Conversation,
  EmptyMessageParams,
  Message,
  Roles
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

  const updateChatCompletionStream = (token?: string) => {
    if (!currConversation) return

    setCurrConversation((prevState) =>
      produce(prevState, (draft) => {
        if (!draft) return

        const lastMessage = draft.messages[draft.messages.length - 1]
        if (token === undefined) {
          const message: Message = {
            messageId: v4(),
            content: '',
            role: Roles.Assistant,
            tokensCount: 0,
            createdAt: +new Date()
          }
          draft.messages.push({ ...message, content: '' })
        } else {
          lastMessage.content += token
        }
      })
    )
  }

  const saveAssistantMessage = () => {
    if (!currConversation) return

    setCurrConversation((prevState) => {
      const newConversation = produce(prevState, (draft) => {
        if (!draft) return
        const lastMessage = draft.messages[draft.messages.length - 1]
        if (lastMessage.role === Roles.Assistant) {
          lastMessage.tokensCount = getTokensCount(
            lastMessage.content,
            (currConversation.configuration as ChatConfiguration).model
          )
        }
        draft.updatedAt = +new Date()
      })

      if (newConversation) {
        updateOneById(currConversation.conversationId, {
          messages: newConversation.messages,
          updatedAt: newConversation.updatedAt
        })
      }

      return newConversation
    })
  }

  const saveUserMessage = async (content: string, tokensCount: number) => {
    if (!currConversation) return

    const message: Message = {
      messageId: v4(),
      content,
      role: Roles.User,
      tokensCount,
      createdAt: +new Date()
    }

    const newConversations = produce(currConversation, (draft) => {
      draft.messages.push(message)
      draft.updatedAt = +new Date()
    })
    setCurrConversation(newConversations)
    await updateOneById(currConversation.conversationId, {
      messages: newConversations.messages,
      updatedAt: newConversations.updatedAt
    })
  }

  return {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage,

    saveUserMessage,
    saveAssistantMessage,
    updateChatCompletionStream
  }
}

export default useMessages
