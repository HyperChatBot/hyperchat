import { produce } from 'immer'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { ChatConfiguration } from 'src/configurations/chatCompletion'
import { useDB } from 'src/hooks'
import { getTokensCount } from 'src/shared/utils'
import { currConversationState } from 'src/stores/conversation'
import { Message, Roles } from 'src/types/conversation'
import { v4 } from 'uuid'

const useMessages = () => {
  const { updateOneById } = useDB('conversations')
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )

  const rollbackMessage = () => {
    if (!currConversation) return

    setCurrConversation((prevState) =>
      produce(prevState, (draft) => {
        draft.messages.pop()
      })
    )
  }

  const updateChatCompletionStream = useCallback(
    (token?: string) => {
      if (!currConversation) return

      setCurrConversation((prevState) =>
        produce(prevState, (draft) => {
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
    },
    [currConversation]
  )

  const saveCommonAssistantMessage = useCallback(
    (content: string) => {
      if (!currConversation) return

      setCurrConversation((prevState) => {
        const newConversation = produce(prevState, (draft) => {
          const message: Message = {
            messageId: v4(),
            content,
            role: Roles.Assistant,
            tokensCount: 0,
            createdAt: +new Date()
          }
          draft.messages.push(message)
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
    },
    [currConversation]
  )

  const saveAssistantMessage = useCallback(() => {
    if (!currConversation) return

    setCurrConversation((prevState) => {
      const newConversation = produce(prevState, (draft) => {
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
  }, [currConversation])

  const saveUserMessage = useCallback(
    (content: string, tokensCount?: number) => {
      if (!currConversation) return

      const message: Message = {
        messageId: v4(),
        content,
        role: Roles.User,
        tokensCount: tokensCount || 0,
        createdAt: +new Date()
      }

      const newConversations = produce(currConversation, (draft) => {
        draft.messages.push(message)
        draft.updatedAt = +new Date()
      })
      setCurrConversation(newConversations)
      updateOneById(currConversation.conversationId, {
        messages: newConversations.messages,
        updatedAt: newConversations.updatedAt
      })
    },
    [currConversation]
  )

  return {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    saveCommonAssistantMessage,
    updateChatCompletionStream
  }
}

export default useMessages
