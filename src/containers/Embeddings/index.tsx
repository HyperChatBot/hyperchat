import { FC } from 'react'
import ChatBox from 'src/components/ChatBox'
import ChatList from 'src/components/ChatList'
import Divider from 'src/components/Divider'

const Embeddings: FC = () => {
  return (
    <>
      <ChatList />
      <Divider direction="vertical" />
      <ChatBox />
    </>
  )
}

export default Embeddings
