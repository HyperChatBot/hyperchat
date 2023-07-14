import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import ConversationList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import Loading from 'src/components/Loading'
import { configurations } from 'src/configurations'
import { useDB } from 'src/hooks'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation as IConversation } from 'src/types/conversation'

const Conversation: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const { getCurrConversations } = useDB('conversations')
  const conversations = useLiveQuery<IConversation[]>(getCurrConversations, [
    currProduct
  ])
  const setCurrConversation = useSetRecoilState(currConversationState)
  const Configuration = configurations[currProduct].component()

  useEffect(() => {
    if (conversations && currProduct) {
      setCurrConversation(conversations[0])
    }
  }, [conversations, currProduct])

  if (!conversations) return <Loading />

  return (
    <>
      <ConversationList conversations={conversations} />
      <Divider direction="vertical" />
      <ChatBox />
      <Configuration />
    </>
  )
}

export default Conversation
