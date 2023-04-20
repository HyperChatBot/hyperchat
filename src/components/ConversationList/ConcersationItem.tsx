import classNames from 'classnames'
import { FC } from 'react'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import { formatDate } from 'src/shared/utils'
import { Conversation } from 'src/types/conversation'
import ItemWrapper from './ItemWrapper'

interface Props {
  active: boolean
  conversation: Conversation
  onClick: () => void
}

const ConversationItem: FC<Props> = ({ active, conversation, onClick }) => {
  const { isSameDay, display } = formatDate(conversation.updated_at)

  return (
    <ItemWrapper onClick={onClick} active={active}>
      <img
        src={ChatGPTLogoImg}
        alt="avatar"
        className="mr-4 h-12 w-12 rounded-xl"
      />
      <div className="flex w-full flex-col">
        <p className="flex justify-between">
          <span
            className={classNames(
              'w-32 truncate text-sm font-semibold dark:text-dark-text',
              { 'w-44': isSameDay }
            )}
          >
            {conversation.summary || conversation.conversation_id}
          </span>
          <span className="text-xs font-semibold text-black text-opacity-30 dark:text-dark-text-sub">
            {display}
          </span>
        </p>

        {conversation.messages.length > 0 && (
          <p className="mt-2 w-48 truncate text-xs font-semibold text-black text-opacity-40 dark:text-dark-text-sub">
            {conversation.messages[conversation.messages.length - 1].answer ||
              conversation.messages[conversation.messages.length - 1].question}
          </p>
        )}
      </div>
    </ItemWrapper>
  )
}

export default ConversationItem
