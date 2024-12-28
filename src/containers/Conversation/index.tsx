import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import Configuration from 'src/components/Configuration'
import ConversationList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import Loading from 'src/components/Loading'
import { db } from 'src/db'
import { conversationState } from 'src/stores/conversation'
import { companyState } from 'src/stores/global'
import { Conversation as IConversation } from 'src/types/conversation'

const Conversation: FC = () => {
  const [conversation, setConversation] = useRecoilState(conversationState)
  const company = useRecoilValue(companyState)
  const conversations = useLiveQuery<IConversation[]>(
    () =>
      db
        .table<IConversation>('conversations')
        .where('company')
        .equals(company)
        .reverse()
        .sortBy('updatedAt'),
    [company]
  )

  useEffect(() => {
    if (
      // Initialing App
      !conversation ||
      // Switching company
      conversation?.company !== company ||
      // Deleting a conversation
      conversations.findIndex((c) => c.id === conversation.id) === -1
    ) {
      setConversation(conversations?.[0])
    }
  }, [conversation, conversations, company])

  if (!conversations) return <Loading />

  return (
    <>
      <ConversationList conversations={conversations} />
      <Divider direction="vertical" />
      <ChatBox />
      <Divider direction="vertical" />
      <Configuration />
    </>
  )
}

export default Conversation
