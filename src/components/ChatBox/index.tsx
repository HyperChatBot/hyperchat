import { FC, Fragment } from 'react'
import ChatBubble from '../ChatBubble'
import ContractHeader from '../ContactHeader'
import Divider from '../Divider'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

const ChatBox: FC = () => {
  return (
    <section className="relative">
      <ContractHeader />
      <Divider />

      <section className="no-scrollbar relative h-[calc(100vh_-_10rem)] overflow-y-scroll p-6">
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

      <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-dark-main-bg">
        <LinearPaperclipIcon className="mr-6" />
        <section className="relative flex w-full ">
          <input
            type="text"
            className="flex-1 rounded-xl border-2 border-main-gray pb-3.5 pl-5 pr-5 pt-3.5 text-sm text-black text-opacity-40 dark:border-dark-search-input-border dark:bg-dark-search-input dark:text-dark-text-sub"
            placeholder="Type a message"
          />
          <BoldSendIcon className="absolute right-5 top-3.5" />
        </section>
      </section>
    </section>
  )
}

export default ChatBox
