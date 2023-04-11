import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import Avatar from '../Avatar'

interface Props {
  role: 'assistant' | 'user'
  avatar: string
  children: ReactNode
}

const ChatBubble: FC<Props> = ({ role, avatar, children }) => {
  return (
    <section
      className={classNames('flex items-start mb-8', {
        'flex-row-reverse': role === 'user'
      })}
    >
      <Avatar
        className={classNames({
          'mr-4': role === 'assistant',
          'ml-4': role === 'user'
        })}
      />
      <section
        className={classNames('rounded-xl pt-2 pr-4 pb-2 pl-4 text-sm', {
          'bg-main-gray text-black': role === 'assistant',
          'bg-main-purple text-white': role === 'user'
        })}
      >
        {children}
      </section>
    </section>
  )
}

export default ChatBubble
