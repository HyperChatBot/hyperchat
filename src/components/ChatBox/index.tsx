import { FC } from 'react'
import { Separator } from 'src/components/ui/separator'
import ChatMessages from './ChatMessages'
import ContractHeader from './ContactHeader'
import InputBox from './InputBox'

const ChatBox: FC = () => {
  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Separator />
      <ChatMessages />
      <InputBox />
    </section>
  )
}

export default ChatBox
