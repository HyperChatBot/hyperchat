import { invoke } from '@tauri-apps/api/tauri'
import { useState } from 'react'
import './App.css'
import ChatBox from './components/ChatBox'
import Divider from './components/Divider'
import MesssageList from './components/MessageList'
import Siderbar from './components/Sidebar'

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
