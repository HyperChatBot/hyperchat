import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import Configuration from 'src/components/Configuration'
import ConversationList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import Loading from 'src/components/Loading'
import { useDB } from 'src/hooks'
import { currConversationState } from 'src/stores/conversation'
import { Conversation as IConversation } from 'src/types/conversation'

const Conversation: FC = () => {
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )

  const { getAllAndOrderByUpdatedAt } = useDB('conversations')
  const conversations = useLiveQuery<IConversation[]>(getAllAndOrderByUpdatedAt)

  useEffect(() => {
    if (conversations && !currConversation) {
      setCurrConversation(conversations[0])
    }
  }, [currConversation, conversations])

  if (!conversations) return <Loading />

  return (
    <>
      <ConversationList conversations={conversations} />
      <Divider direction="vertical" />
      <ChatBox />
      <Divider direction="vertical" />
      {currConversation ? <Configuration /> : null}
    </>
  )
}

export default Conversation
