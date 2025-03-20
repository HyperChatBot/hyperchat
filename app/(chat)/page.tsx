import { Chat } from '@/components/chatbox/chat'
import { v4 as uuidV4 } from 'uuid'

export default async function Page() {
  const id = uuidV4()
  return <Chat id={id} initialMessages={[]} />
}
