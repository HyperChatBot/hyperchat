import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import Avatar from '../Avatar'

interface Props {
  role: 'assistant' | 'user'
  avatar: string
  children: ReactNode
}

const ChatBubble: FC<Props> = ({ role, avatar, children }) => {
  return (
    <section
      className={classNames('mb-8 flex items-start', {
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
        className={classNames('rounded-xl pb-2 pl-4 pr-4 pt-2 text-sm', {
          'bg-main-gray text-black  dark:bg-dark-bubule-assistant-bg dark:text-dark-bubule-assistant-text':
            role === 'assistant',
          'bg-main-purple text-white dark:text-dark-bubule-assistant-text':
            role === 'user'
        })}
      >
        {children}
      </section>
    </section>
  )
}

export default ChatBubble
