import { capitalCase } from 'change-case'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { configurations } from 'src/configurations'
import { useDB } from 'src/hooks'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { OutlinePlusIcon } from '../Icons'
import ConversationItem from './ConversationItem'
import ChatEmpty from './EmptyItem'

interface Props {
  conversations: Conversation[]
}

const ConversationList: FC<Props> = ({ conversations }) => {
  const currProduct = useRecoilValue(currProductState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )
  const { insertOne } = useDB('conversations')

  const addConversation = async () => {
    const chatId = v4()

    const conversation: Conversation = {
      avatar: '',
      conversationId: chatId,
      summary: '',
      messages: [],
      product: currProduct,
      createdAt: +new Date(),
      updatedAt: +new Date(),
      configuration: configurations[currProduct].default
    }

    setCurrConversation(conversation)
    insertOne(conversation)
  }

  const switchConversation = (conversation: Conversation) => {
    setCurrConversation(conversation)
  }

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <span className="mr-4 truncate text-xl font-semibold dark:text-dark-text">
          {capitalCase(currProduct)}
        </span>
        <OutlinePlusIcon onClick={addConversation} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.conversationId}
              active={
                conversation.conversationId === currConversation?.conversationId
              }
              conversation={conversation}
              onClick={() => switchConversation(conversation)}
            />
          ))
        ) : (
          <ChatEmpty onClick={addConversation} />
        )}
      </section>
    </section>
  )
}

export default ConversationList
