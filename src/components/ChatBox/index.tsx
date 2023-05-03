import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { db } from 'src/models/db'
import { currConversationIdState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import Divider from '../Divider'
import ChatList from './ChatList'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db[currProduct].get(currConversationId),
    [currConversationId, currProduct]
  )

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
  }, [currConversationId])

  return (
    <section className="relative flex-1">
      <ContractHeader currConversation={currConversation} />
      <Divider />
      <ChatList chatBoxRef={chatBoxRef} currConversation={currConversation} />
      {currConversation && <InputBox />}
    </section>
  )
}

export default ChatBox
