import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import ChatBox from 'src/components/ChatBox'
import Divider from 'src/components/Divider'
import MesssageList from 'src/components/MessageList'
import Siderbar from 'src/components/Sidebar'
import { useCollection } from 'src/hooks'
import { ChatDocument } from 'src/schemas/chatSchema'
import { chatStore } from 'src/stores'
import './App.css'

const App = () => {
  const chatCollection = useCollection('chat')
  const setChatSate = useSetRecoilState(chatStore.chatState)

  const getChatData = async () => {
    const res: ChatDocument[] = await chatCollection.find().exec()
    setChatSate(res.map((data) => data._data))
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
