import throttle from 'lodash.throttle'
import { FC, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currConversationIdState, scrollToBottomBtnVisibleState } from 'src/stores/conversation'
import Divider from '../Divider'
import ContractHeader from './ContactHeader'
import ConversationBox from './ConversationBox'
import InputBox from './InputBox'
import ScrollToBottom from './ScrollToBottom'

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currConversationId = useRecoilValue(currConversationIdState)
  const [scrollToBottomBtnVisible, setScrollToBottomBtnVisible] =
    useRecoilState(scrollToBottomBtnVisibleState)

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
    setScrollToBottomBtnVisible(false)
    scrollToBottom()
  }, [currConversationId])

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
      <ConversationBox chatBoxRef={chatBoxRef} />
      {currConversationId && <InputBox showScrollToBottomBtn={showScrollToBottomBtn} />}
      <ScrollToBottom onClick={scrollToBottom} />
    </section>
  )
}

export default ChatBox
