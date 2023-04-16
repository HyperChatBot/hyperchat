import { Image } from '@chakra-ui/react'
import classNames from 'classnames'
import throttle from 'lodash.throttle'
import { FC, Fragment, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import {
  currChatIdState,
  currChatState,
  scrollToBottomBtnVisibleState
} from 'src/stores/chat'
import Divider from '../Divider'
import ChatBubble from './ChatBubble'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'
import ScrollToBottom from './ScrollToBottom'

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currChat = useRecoilValue(currChatState)
  const currChatId = useRecoilValue(currChatIdState)
  const [scrollToBottomBtnVisible, setScrollToBottomBtnVisible] =
    useRecoilState(scrollToBottomBtnVisibleState)

  const hasMessages = currChat && currChat.messages.length > 0

  const needScrollToBottom = () => {
    if (!chatBoxRef.current) return false
    const $el = chatBoxRef.current

    return $el.scrollHeight > $el.scrollTop + $el.clientHeight + 24
  }

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight + 24) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })

      setScrollToBottomBtnVisible(false)
    }
  }

  const showScrollToBottomBtn = () => {
    if (!scrollToBottomBtnVisible && needScrollToBottom()) {
      setScrollToBottomBtnVisible(true)
    } else {
      setScrollToBottomBtnVisible(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currChatId])

  useEffect(() => {
    chatBoxRef.current?.addEventListener(
      'scroll',
      throttle(showScrollToBottomBtn, 100)
    )

    return () => {
      chatBoxRef.current?.removeEventListener(
        'scroll',
        throttle(showScrollToBottomBtn, 100)
      )
    }
  }, [chatBoxRef.current])

  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />

      <section
        className={classNames(
          'no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6',
          { 'flex items-center justify-center': !hasMessages }
        )}
        ref={chatBoxRef}
      >
        {hasMessages ? (
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
        ) : (
          <Image
            src={NoDataIllustration}
            alt="NoDataIllustration"
            className="h-96 w-96 dark:opacity-50"
          />
        )}
      </section>

      <InputBox showScrollToBottomBtn={showScrollToBottomBtn} />
      <ScrollToBottom onClick={scrollToBottom} />
    </section>
  )
}

export default ChatBox
