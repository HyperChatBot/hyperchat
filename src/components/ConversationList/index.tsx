import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useInsertDocument } from 'src/hooks'
import { ChatDocType } from 'src/schemas/chatSchema'
import { conversationTitles, schemaNames } from 'src/shared/constants'
import {
  conversationsState,
  currConversationIdState
} from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { BoldAddIcon } from '../Icons'
import ConversationItem from './ConversationItem'
import ChatEmpty from './EmptyItem'

const ConversationList: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const [conversations, setConversations] = useRecoilState(conversationsState)
  const [currConversationId, setCurrConversationId] = useRecoilState(
    currConversationIdState
  )
  const { insertDocument } = useInsertDocument<ChatDocType>(
    schemaNames[currProduct]
  )

  const addChat = async () => {
    const chatId = v4()

    const conversation: Conversation = {
      conversation_id: chatId,
      summary: '',
      messages: [],
      created_at: +new Date(),
      updated_at: +new Date()
    }

    setConversations([...conversations, conversation])
    setCurrConversationId(chatId)
    insertDocument(conversation)
  }

  const switchChat = (id: string) => {
    setCurrConversationId(id)
  }

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <span className="mr-4 text-xl font-semibold dark:text-dark-text">
          {conversationTitles[currProduct]}
        </span>
        <BoldAddIcon onClick={addChat} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.conversation_id}
              active={conversation.conversation_id === currConversationId}
              conversation={conversation}
              onClick={() => switchChat(conversation.conversation_id)}
            />
          ))
        ) : (
          <ChatEmpty onClick={addChat} />
        )}
      </section>
    </section>
  )
}

export default ConversationList
