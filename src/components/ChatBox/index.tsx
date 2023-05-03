import { useLiveQuery } from 'dexie-react-hooks'
import throttle from 'lodash.throttle'
import { FC, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { db } from 'src/models/db'
import {
  currConversationIdState,
  scrollToBottomBtnVisibleState
} from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import Divider from '../Divider'
import ChatList from './ChatList'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'
import ScrollToBottom from './ScrollToBottom'

const ChatBox: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db[currProduct].get(currConversationId),
    [currConversationId, currProduct]
  )

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
      <ContractHeader currConversation={currConversation} />
      <Divider />
      <ChatList chatBoxRef={chatBoxRef} currConversation={currConversation} />
      {currConversation && (
        <InputBox showScrollToBottomBtn={showScrollToBottomBtn} />
      )}
      <ScrollToBottom onClick={scrollToBottom} />
    </section>
  )
}

export default ChatBox
