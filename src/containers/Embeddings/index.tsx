import { FC } from 'react'
import ChatBox from 'src/components/ChatBox'
import ChatList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import { SchemaNames } from 'src/types/base'

const Embeddings: FC = () => {
  return (
    <>
      <ChatList schemaName={SchemaNames.Embedding} />
      <Divider direction="vertical" />
      <ChatBox />
    </>
  )
}

export default Embeddings
