import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { useInsertDocument } from 'src/hooks'
import { ChatDocType } from 'src/schemas'
import { chatStore } from 'src/stores'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { BoldAddIcon, LinearArrowDownIcon } from '../Icons'
import MesssageItem from '../MessageItem'

const MesssageList: FC = () => {
  const [chats, setChats] = useRecoilState(chatStore.chatsState)
  const [currChatId, setCurrChatId] = useRecoilState(chatStore.currChatIdState)
  const { insertDocument } = useInsertDocument<ChatDocType>('chat')

  const addChat = async () => {
    const chatId = v4()

    const model = {
      chat_id: chatId,
      summary: '',
      messages: []
    }

    setChats([...chats, model])
    setCurrChatId(chatId)

    insertDocument(model)
  }

  const switchChat = (id: string) => {
    setCurrChatId(id)
  }

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <section className="flex items-center">
          <span className="text-xl font-semibold dark:text-dark-text">
            Messsage
          </span>
          <LinearArrowDownIcon className="ml-1.5 mr-2.5" />
          <span className="dark:text-dark-sub-text rounded-3xl bg-default-badge pb-0.5 pl-2 pr-2 pt-0.5 text-xs font-semibold">
            12
          </span>
        </section>
        <BoldAddIcon onClick={addChat} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {chats.map((chat) => (
          <MesssageItem
            key={chat.chat_id}
            active={chat.chat_id === currChatId}
            chat={chat}
            onClick={() => switchChat(chat.chat_id)}
          />
        ))}
      </section>
    </section>
  )
}

export default MesssageList
