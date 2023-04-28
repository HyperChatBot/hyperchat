import classNames from 'classnames'
import { DateTime } from 'luxon'
import { FC, ReactNode } from 'react'
import Avatar from '../Avatar'

interface Props {
  role: 'assistant' | 'user'
  avatar: string
  children: ReactNode
  date: number
}

const ChatBubble: FC<Props> = ({ role, avatar, date, children }) => {
  return (
    <section
      className={classNames('group mb-8 flex items-start', {
        'flex-row-reverse': role === 'user'
      })}
    >
      <Avatar
        src={avatar}
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
          className={classNames('max-w-160 rounded-xl px-3 py-3 text-sm', {
            'bg-main-gray text-black dark:bg-gray-700 dark:text-dark-bubule-assistant-text':
              role === 'assistant',
            'flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap break-words bg-main-purple text-white dark:text-dark-bubule-assistant-text':
              role === 'user'
          })}
        >
          {children}
        </section>
        <p
          className={
            'mt-2 text-xs text-black text-opacity-30 opacity-0 transition duration-250 ease-in-out group-hover:opacity-100 group-hover:duration-250 dark:text-dark-bubule-assistant-text dark:text-opacity-30'
          }
        >
          {DateTime.fromMillis(date).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS
          )}
        </p>
      </section>
    </section>
  )
}

export default ChatBubble
