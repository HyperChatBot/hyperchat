import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import MesssageList from './components/MessageList'
import Siderbar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Divider from './components/Divider'
import './App.css'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }))
  }

  return (
    <div className="container flex flex-row">
      <Siderbar />
      <MesssageList />
      <Divider direction="vertical" />
      <ChatBox />
      <Divider direction="vertical" />
    </div>
  )
}

export default App
