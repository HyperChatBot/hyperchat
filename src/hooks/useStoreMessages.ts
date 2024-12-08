import { produce, WritableDraft } from 'immer'
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartText
} from 'openai/resources'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { ChatConfiguration } from 'src/configurations/chatCompletion'
import { useDB } from 'src/hooks'
import { getTokensCount } from 'src/shared/utils'
import { currConversationState } from 'src/stores/conversation'
import { AudioContentPart, Message, Roles } from 'src/types/conversation'
import { v4 } from 'uuid'

const useStoreMessages = () => {
  const { updateOneById } = useDB('conversations')
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )

  // If a stream chat completion request fails, delete it in the user interface.
  const rollbackMessage = () => {
    if (!currConversation) return

    setCurrConversation((prevState) =>
      produce(prevState, (draft) => {
        if (!draft) return
        draft.messages.pop()
      })
    )
  }

  const updateChatCompletionStream = useCallback(
    (token?: string) => {
      if (!currConversation) return

      setCurrConversation((prevState) =>
        produce(prevState, (draft) => {
          if (!draft) return

          const { role, content } = draft.messages[draft.messages.length - 1]

          if (role !== Roles.Assistant) {
            if (token) {
              const message: Message = {
                messageId: v4(),
                role: Roles.Assistant,
                content: [{ type: 'text', text: token }],
                tokensCount: 0,
                createdAt: +new Date()
              }
              draft.messages.push(message)
            }
          } else {
            // Assume assistant always returns text
            const textContent =
              content[0] as WritableDraft<ChatCompletionContentPartText>
            textContent.text += token
          }
        })
      )
    },
    [currConversation]
  )

  const saveCommonAssistantMessage = useCallback(
    (content: ChatCompletionContentPartText[]) => {
      if (!currConversation) return

      setCurrConversation((prevState) => {
        const newConversation = produce(prevState, (draft) => {
          if (!draft) return
          const message: Message = {
            messageId: v4(),
            role: Roles.Assistant,
            content,
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
        if (!draft) return
        const lastMessage = draft.messages[draft.messages.length - 1]

        if (lastMessage.role === Roles.Assistant) {
          lastMessage.tokensCount = getTokensCount(
            (
              lastMessage.content as WritableDraft<
                ChatCompletionContentPartText[]
              >
            )[0].text,
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
    async (
      content: (ChatCompletionContentPart | AudioContentPart)[],
      tokensCount?: number
    ) => {
      if (!currConversation) return

      const message: Message = {
        messageId: v4(),
        role: Roles.User,
        content,
        tokensCount: tokensCount || 0,
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

export default useStoreMessages
