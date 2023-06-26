import { useLiveQuery } from 'dexie-react-hooks'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import ConversationList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import Loading from 'src/components/Loading'
import { configurations } from 'src/configurations'
import { db } from 'src/models/db'
import { currProductState } from 'src/stores/global'

const Conversation: FC = () => {
  const currProduct = useRecoilValue(currProductState)
  const conversations = useLiveQuery(
    () => db[currProduct].orderBy('updated_at').reverse().toArray(),
    [currProduct]
  )
  const Configuration = configurations[currProduct].component()

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
