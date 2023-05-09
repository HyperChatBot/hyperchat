import { FC } from 'react'
import Divider from '../Divider'
import ChatMessages from './ChatMessages'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />
      <ChatMessages />
      <InputBox />
    </section>
  )
}

export default ChatBox
