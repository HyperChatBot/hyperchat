import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import Avatar from '../Avatar'

interface Props {
  role: 'assistant' | 'user'
  avatar: string
  children: ReactNode
}

const ChatBubble: FC<Props> = ({ role, avatar, children }) => {
  return (
    <section
      className={classNames('group mb-8 flex items-start', {
        'flex-row-reverse': role === 'user'
      })}
    >
      <Avatar
        src={ChatGPTLogoImg}
        className={classNames({
          'mr-4': role === 'assistant',
          'ml-4': role === 'user'
        })}
      />
      <section
        className={classNames('flex flex-col', {
          'items-start': role === 'assistant',
          'items-end': role === 'user'
        })}
      >
        <section
          className={classNames('max-w-160 rounded-xl pl-4 pr-4 pt-2 text-sm', {
            'bg-main-gray text-black dark:bg-dark-bubule-assistant-bg dark:text-dark-bubule-assistant-text':
              role === 'assistant',
            'bg-main-purple pb-2 text-white dark:text-dark-bubule-assistant-text':
              role === 'user'
          })}
        >
          {children}
        </section>
        <p
          className={classNames(
            'duration-250 group-hover:duration-250 mt-2 text-xs opacity-0 transition ease-in-out group-hover:opacity-100',
            {
              'text-black text-opacity-30 dark:text-dark-bubule-assistant-text dark:text-opacity-30':
                role === 'assistant',
              'text-white text-opacity-30 dark:text-dark-bubule-assistant-text dark:text-opacity-30':
                role === 'user'
            }
          )}
        >
          2022/12/31 12:00:01
        </p>
      </section>
    </section>
  )
}

export default ChatBubble
