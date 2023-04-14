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
  const [chatState, setChatSate] = useRecoilState(chatStore.chatState)
  const { insertDocument } = useInsertDocument<ChatDocType>('chat')

  const addChat = async () => {
    insertDocument({
      chat_id: v4(),
      summary: '',
      messages: [],
      created_at: +new Date(),
      updated_at: +new Date()
    })
  }

  return (
    <section className="">
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

      <input
        type="text"
        className="mb-3 ml-6 mr-6 mt-3 w-75 rounded-xl bg-search-input pb-3 pl-2.5 pr-2.5 pt-3 text-sm text-black text-opacity-40 focus:border-transparent  dark:bg-dark-search-input"
      />

      <section className="no-scrollbar ml-4 mr-4 h-[calc(100vh_-_9.8125rem)] overflow-y-scroll">
        {chatState?.map((chat, k) => (
          <MesssageItem key={k} active={k === 1} chat={chat} />
        ))}
      </section>
    </section>
  )
}

export default MesssageList
