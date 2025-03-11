'use client'

import { Roles } from '@/types/conversation'
import { UseChatHelpers } from '@ai-sdk/react'
import { FC, memo, useRef } from 'react'
import ChatBubble from './chat-bubble'
import MessageSpinner from './message-spinner'

interface Props {
  chatId: string
  messages: UseChatHelpers['messages']
  setMessages: UseChatHelpers['setMessages']
  status: UseChatHelpers['status']
  reload: UseChatHelpers['reload']
}

const Messages: FC<Props> = ({
  chatId,
  messages,
  setMessages,
  status,
  reload
}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className={
        'no-scrollbar flex min-w-0 flex-1 flex-col items-center gap-6 overflow-y-scroll p-4'
      }
      ref={chatBoxRef}
    >
      <div className="w-full md:max-w-3xl">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {status === 'submitted' &&
          messages[messages.length - 1].role !== Roles.Assistant && (
            <MessageSpinner />
          )}
      </div>
    </section>
  )
}

export default memo(Messages)
