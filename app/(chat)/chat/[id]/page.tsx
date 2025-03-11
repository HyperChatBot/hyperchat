import { Chat } from '@/components/chatbox/chat'
import { getChatById, getMessagesByChatId } from '@/lib/db/queries'
import { convertToUIMessages } from '@/lib/utils'
import { notFound } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const chat = await getChatById({ id })

  if (!chat) {
    notFound()
  }

  const messagesFromDb = await getMessagesByChatId({
    id
  })

  return (
    <Chat id={chat.id} initialMessages={convertToUIMessages(messagesFromDb)} />
  )
}
