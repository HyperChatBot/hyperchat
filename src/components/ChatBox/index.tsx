import throttle from 'lodash.throttle'
import { FC, Fragment, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import {
  currChatIdState,
  currChatState,
  scrollToBottomBtnVisibleState
} from 'src/stores/chat'
import ChatBubble from '../ChatBubble'
import ContractHeader from '../ContactHeader'
import Divider from '../Divider'
import Markdown from '../Markdown'
import MessageSpinner from '../MessageSpinner'
import ScrollToBottom from '../ScrollToBottom'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currChat = useRecoilValue(currChatState)
  const currChatId = useRecoilValue(currChatIdState)
  const [scrollToBottomBtnVisible, setScrollToBottomBtnVisible] =
    useRecoilState(scrollToBottomBtnVisibleState)

  const needScrollToBottom = () => {
    if (!chatBoxRef.current) return false
    const $el = chatBoxRef.current

    return $el.scrollHeight > $el.scrollTop + $el.clientHeight
  }

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })

      setScrollToBottomBtnVisible(false)
    }
  }

  const showScrollToBottomBtn = throttle(() => {
    if (!scrollToBottomBtnVisible && needScrollToBottom()) {
      setScrollToBottomBtnVisible(true)
    } else {
      setScrollToBottomBtnVisible(false)
    }
  }, 100)

  useEffect(() => {
    scrollToBottom()
  }, [currChatId])

  useEffect(() => {
    chatBoxRef.current?.addEventListener('scroll', showScrollToBottomBtn)

    return () => {
      chatBoxRef.current?.removeEventListener('scroll', showScrollToBottomBtn)
    }
  }, [chatBoxRef.current])

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

      <InputBox showScrollToBottomBtn={showScrollToBottomBtn} />
      <ScrollToBottom onClick={scrollToBottom} />
    </section>
  )
}

export default ChatBox
