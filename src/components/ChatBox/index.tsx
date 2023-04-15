import { FC, Fragment, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import { currChatState } from 'src/stores/chat'
import ChatBubble from '../ChatBubble'
import ContractHeader from '../ContactHeader'
import Divider from '../Divider'
import Markdown from '../Markdown'
import MessageSpinner from '../MessageSpinner'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currChat = useRecoilValue(currChatState)

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })
    }
  }

  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />

      <section
        className="no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6"
        ref={chatBoxRef}
      >
        {currChat && currChat.messages.length > 0 && (
          <>
            {currChat.messages.map((message) => (
              <Fragment key={message.message_id}>
                <ChatBubble
                  role="user"
                  avatar=""
                  date={message.question_created_at}
                >
                  {message.question}
                </ChatBubble>
                <ChatBubble
                  role="assistant"
                  avatar={''}
                  date={message.answer_created_at}
                >
                  {message.message_id === EMPTY_MESSAGE_ID ? (
                    <MessageSpinner />
                  ) : (
                    <Markdown content={message.answer} />
                  )}
                </ChatBubble>
              </Fragment>
            ))}
          </>
        )}
      </section>

      <InputBox />
    </section>
  )
}

export default ChatBox
