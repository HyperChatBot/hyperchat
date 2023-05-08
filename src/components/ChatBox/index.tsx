import { FC, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { currConversationState } from 'src/stores/conversation'
import Divider from '../Divider'
import ChatList from './ChatList'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currConversation = useRecoilValue(currConversationState)

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight + 24) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currConversation])

  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />
      <ChatList chatBoxRef={chatBoxRef} currConversation={currConversation} />
      {currConversation && <InputBox />}
    </section>
  )
}

export default ChatBox
