import classNames from 'classnames'
import { FC } from 'react'
import Avatar from 'src/assets/avatar_mock.png'
import { formatDate } from 'src/shared/utils'
import { Chat } from 'src/types/chat'

interface Props {
  active: boolean
  chat: Chat
  onClick: () => void
}

const MesssageItem: FC<Props> = ({ active, chat, onClick }) => {
  const { isSameDay, display } = formatDate(chat.updated_at)

  return (
    <div
      className={classNames(
        'mb-2 flex w-80 cursor-pointer rounded-2xl p-3 transition duration-250 ease-linear hover:bg-main-purple hover:bg-opacity-5',
        {
          'bg-main-purple bg-opacity-5': active
        }
      )}
      onClick={onClick}
    >
      <img src={Avatar} alt="avatar" className="mr-4 h-12 w-12 rounded-xl" />
      <div className="flex w-full flex-col">
        <p className="flex justify-between">
          <span
            className={classNames(
              'w-32 truncate text-sm font-semibold dark:text-dark-text',
              { 'w-44': isSameDay }
            )}
          >
            {chat.chat_id}
          </span>
          <span className="text-xs font-semibold text-black text-opacity-30 dark:text-dark-text-sub">
            {display}
          </span>
        </p>

        {chat.messages.length > 0 && (
          <p className="mt-2 w-48 truncate text-xs font-semibold text-black text-opacity-40 dark:text-dark-text-sub">
            {chat.messages[chat.messages.length - 1].answer ||
              chat.messages[chat.messages.length - 1].question}
          </p>
        )}
      </div>
    </div>
  )
}

export default MesssageItem
