import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { useInsertDocument } from 'src/hooks'
import { ChatDocType } from 'src/schemas/chatSchema'
import { chatsState, currChatIdState } from 'src/stores/chat'
import { Chat } from 'src/types/chat'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { BoldAddIcon } from '../Icons'
import ChatEmpty from './ChatEmpty'
import ChatItem from './ChatItem'

const ChatItemWrapper: FC = () => {
  const [chats, setChats] = useRecoilState(chatsState)
  const [currChatId, setCurrChatId] = useRecoilState(currChatIdState)
  const { insertDocument } = useInsertDocument<ChatDocType>('chat')

  const addChat = async () => {
    const chatId = v4()

    const chat: Chat = {
      chat_id: chatId,
      summary: '',
      messages: [],
      created_at: +new Date(),
      updated_at: +new Date()
    }

    setChats([...chats, chat])
    setCurrChatId(chatId)
    insertDocument(chat)
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
          chats.map((chat) => (
            <ChatItem
              key={chat.chat_id}
              active={chat.chat_id === currChatId}
              chat={chat}
              onClick={() => switchChat(chat.chat_id)}
            />
          ))
        ) : (
          <ChatEmpty onClick={addChat} />
        )}
      </section>
    </section>
  )
}

export default ChatItemWrapper
