import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { db } from 'src/models/db'
import { conversationTitles } from 'src/shared/constants'
import { currConversationIdState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { BoldAddIcon } from '../Icons'
import ConversationItem from './ConversationItem'
import ChatEmpty from './EmptyItem'

const ConversationList: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const conversations = useLiveQuery(
    () => db[currProduct].orderBy('updated_at').reverse().toArray(),
    [currProduct]
  )
  const [currConversationId, setCurrConversationId] = useRecoilState(
    currConversationIdState
  )

  const addConversation = async () => {
    const chatId = v4()

    const conversation: Conversation = {
      avatar: '',
      conversation_id: chatId,
      summary: '',
      messages: [],
      created_at: +new Date(),
      updated_at: +new Date()
    }

    setCurrConversationId(chatId)
    db[currProduct].add(conversation)
  }

  const switchChat = (id: string) => {
    setCurrConversationId(id)
  }

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setCurrConversationId(conversations[0].conversation_id)
    }
  }, [conversations])

  if (!conversations) return null

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <span className="mr-4 text-xl font-semibold dark:text-dark-text">
          {conversationTitles[currProduct]}
        </span>
        <BoldAddIcon onClick={addConversation} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {conversations?.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.conversation_id}
              active={conversation.conversation_id === currConversationId}
              conversation={conversation}
              onClick={() => switchChat(conversation.conversation_id)}
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
