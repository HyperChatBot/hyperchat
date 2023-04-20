import { FC } from 'react'
import ChatBox from 'src/components/ChatBox'
import ChatList from 'src/components/ConversationList'
import Divider from 'src/components/Divider'
import { Products } from 'src/types/global'

const ChatCompletion: FC = () => {
  return (
    <>
      <ChatList schemaName={Products.ChatCompletion} />
      <Divider direction="vertical" />
      <ChatBox />
    </>
  )
}

export default ChatCompletion
