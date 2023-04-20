import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { useInsertDocument } from 'src/hooks'
import { ChatDocType } from 'src/schemas/chatSchema'
import { conversationsState, currConversationIdState } from 'src/stores/conversation'
import { SchemaNames } from 'src/types/base'
import { Conversation } from 'src/types/conversation'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { BoldAddIcon } from '../Icons'
import ChatEmpty from './EmptyItem'
import ChatItem from './ConcersationItem'

interface Props {
  schemaName: SchemaNames
}

const ConversationList: FC<Props> = ({ schemaName }) => {
  const [chats, setChats] = useRecoilState(conversationsState)
  const [currChatId, setCurrChatId] = useRecoilState(currConversationIdState)
  const { insertDocument } = useInsertDocument<ChatDocType>(schemaName)

  const addChat = async () => {
    const chatId = v4()

    const conversation: Conversation = {
      conversation_id: chatId,
      summary: '',
      messages: [],
      created_at: +new Date(),
      updated_at: +new Date()
    }

    setChats([...chats, conversation])
    setCurrChatId(chatId)
    insertDocument(conversation)
  }

  const switchChat = (id: string) => {
    setCurrChatId(id)
  }

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <section className="flex items-center">
          <span className="mr-4 text-xl font-semibold dark:text-dark-text">
            Chat Completion
          </span>
          {chats.length > 0 && (
            <span className="dark:text-dark-sub-text rounded-3xl bg-default-badge pb-0.5 pl-2 pr-2 pt-0.5 text-xs font-semibold">
              {chats.length}
            </span>
          )}
        </section>
        <BoldAddIcon onClick={addChat} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {chats.length > 0 ? (
          chats.map((conversation) => (
            <ChatItem
              key={conversation.conversation_id}
              active={conversation.conversation_id === currChatId}
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
