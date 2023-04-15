import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import Divider from 'src/components/Divider'
import MesssageList from 'src/components/MessageList'
import Siderbar from 'src/components/Sidebar'
import { useCollection } from 'src/hooks'
import { ChatDocument } from 'src/schemas/chatSchema'
import { chatsState, currChatIdState } from 'src/stores/chat'
import { Chat } from 'src/types/chat'
import './App.css'

const App = () => {
  const chatCollection = useCollection('chat')
  const setChats = useSetRecoilState(chatsState)
  const setCurrChat = useSetRecoilState(currChatIdState)

  const getChatData = async () => {
    const res: ChatDocument[] = await chatCollection
      .find({
        sort: [{ updated_at: 'desc' }]
      })
      .exec()

      console.log(res.map((data) => data.toJSON()))

    setChats(res.map((data) => data.toJSON()) as Chat[])
    setCurrChat(res[0]?.chat_id || '')
  }

  useEffect(() => {
    getChatData()
  }, [])

  return (
    <div className="container flex w-screen flex-row overflow-x-hidden dark:bg-dark-main-bg">
      <Siderbar />
      <MesssageList />
      <Divider direction="vertical" />
      <ChatBox />
    </div>
  )
}

export default App
