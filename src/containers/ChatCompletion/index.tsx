import { FC } from 'react'
import ChatBox from 'src/components/ChatBox'
import ChatList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import { SchemaNames } from 'src/types/base'

const ChatCompletion: FC = () => {
  return (
    <>
      <ChatList schemaName={SchemaNames.ChatCompletion} />
      <Divider direction="vertical" />
      <ChatBox />
    </>
  )
}

export default ChatCompletion
