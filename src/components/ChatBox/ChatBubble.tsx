import classNames from 'classnames'
import { DateTime } from 'luxon'
import { FC, ReactNode, memo } from 'react'
import { Roles } from 'src/types/conversation'
import Avatar from '../Avatar'

interface Props {
  role: Roles
  avatar: string
  children: ReactNode
  date: number
}

const ChatBubble: FC<Props> = ({ role, avatar, date, children }) => (
  <section
    className={classNames('group mb-8 flex items-start', {
      'flex-row-reverse': role === Roles.User
    })}
  >
    {role === Roles.Assistant && (
      <Avatar
        src={avatar}
        className={classNames({
          'mr-4': role === Roles.Assistant
        })}
      />
    )}

    <section
      className={classNames('flex flex-col', {
        'items-start': role === Roles.Assistant,
        'items-end': role === Roles.User
      })}
    >
      <section
        className={classNames('max-w-160 rounded-2xl p-4 text-sm', {
          'rounded-tl-none bg-main-gray text-black dark:bg-gray-700 dark:text-dark-bubble-assistant-text':
            role === Roles.Assistant,
          'flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap break-words rounded-br-none bg-main-purple text-white':
            role === Roles.User
        })}
      >
        {children}
      </section>
      <p
        className={
          'mt-2 text-xs text-black text-opacity-30 opacity-0 transition duration-250 ease-in-out group-hover:opacity-100 group-hover:duration-250 dark:text-dark-bubble-assistant-text dark:text-opacity-30'
        }
      >
        {DateTime.fromMillis(date).toLocaleString(
          DateTime.DATETIME_SHORT_WITH_SECONDS
        )}
      </p>
    </section>
  </section>
)

export default memo(
  ChatBubble,
  (prevProps, nextProps) => prevProps.children === nextProps.children
)
