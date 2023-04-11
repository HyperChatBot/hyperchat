import { FC, Fragment } from 'react'
import Divider from '../Divider'
import ContractHeader from '../ContactHeader'
import ChatBubble from '../ChatBubble'
import { LinearPaperclipIcon, BoldSendIcon } from '../Icons'

const ChatBox: FC = () => {
  return (
    <section className="relative">
      <ContractHeader />
      <Divider />

      <section className="p-6 h-[calc(100vh_-_10rem)] overflow-y-scroll no-scrollbar relative">
        {new Array(10).fill(0).map((_, k) => (
          <Fragment key={k}>
            <ChatBubble role="assistant" avatar="">
              How are you?
            </ChatBubble>
            <ChatBubble role="user" avatar="">
              How are you?
            </ChatBubble>
          </Fragment>
        ))}
      </section>

      <section className="flex items-center w-[calc(100%_-_3rem)] absolute left-6 bottom-6 bg-white pt-6">
        <LinearPaperclipIcon className="mr-6" />
        <section className="flex w-full border-main-gray relative">
          <input
            type="text"
            className="text-black text-opacity-40 text-sm pt-3.5 pr-5 pb-3.5 pl-5 flex-1 rounded-xl border-main-gray border-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Type a message"
          />
          <BoldSendIcon className="absolute right-5 top-3.5" />
        </section>
      </section>
    </section>
  )
}

export default ChatBox
