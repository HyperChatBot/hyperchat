import { cn } from '@/lib/utils'
import { customBotAvatarUrlAtom } from '@/stores/global'
import { Roles } from '@/types/conversation'
import { UIMessage } from 'ai'
import { useAtomValue } from 'jotai'
import { FC, memo } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import Markdown from './markdown'

interface Props {
  message: UIMessage
}

const ChatBubble: FC<Props> = ({ message }) => {
  const customBotAvatarUrl = useAtomValue(customBotAvatarUrlAtom)

  return (
    <section
      className={cn('group mb-8 flex items-start', {
        'flex-row-reverse': message.role === Roles.User
      })}
    >
      {message.role === Roles.Assistant && (
        <Avatar
          className={cn({
            'mr-4': message.role === Roles.Assistant
          })}
        >
          <AvatarImage src="/logo.png" />
        </Avatar>
      )}

      <section
        className={cn('flex flex-col', {
          'items-start': message.role === Roles.Assistant,
          'items-end': message.role === Roles.User
        })}
      >
        <div
          className={cn({
            'bg-accent rounded-xl px-3 py-2 break-words whitespace-pre-wrap':
              message.role === Roles.User
          })}
        >
          {message.role === Roles.Assistant && (
            <Markdown src={message.content} />
          )}

          {message.role === Roles.User && <p>{message.content}</p>}
        </div>
      </section>
    </section>
  )
}

export default memo(ChatBubble)
