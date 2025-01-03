import classNames from 'classnames'
import { FC } from 'react'
import ChatGPTLogoImg from 'src/assets/chatbot.png'
import { formatDate } from 'src/shared/utils'
import { Conversation } from 'src/types/conversation'
import ItemWrapper from './ItemWrapper'

interface Props {
  active: boolean
  conversation: Conversation
  onClick: () => void
}

const ConversationItem: FC<Props> = ({ active, conversation, onClick }) => {
  const { isSameDay, display } = formatDate(conversation.updatedAt)

  const showLastMessage = () => {
    const { content } = conversation.messages[conversation.messages.length - 1]
    const lastMessage = content[content.length - 1]

    if (lastMessage.type === 'image_url') {
      return '[Image]'
    } else if (lastMessage.type === 'text') {
      return lastMessage.text
    }

    return ''
  }

  return (
    <ItemWrapper onClick={onClick} active={active}>
      {conversation.avatar ? (
        <div className="mr-4 flex items-center justify-center text-5xl">
          {conversation.avatar}
        </div>
      ) : (
        <img
          src={ChatGPTLogoImg}
          alt="avatar"
          className="mr-4 h-12 w-12 rounded-xl"
        />
      )}

      <div className="flex w-full flex-col">
        <p className="flex justify-between">
          <span
            className={classNames(
              'w-32 truncate text-sm font-semibold dark:text-dark-text',
              { 'w-44': isSameDay }
            )}
          >
            {conversation.summary || conversation.conversationId}
          </span>
          <span className="text-xs font-semibold text-black text-opacity-30 dark:text-dark-text-sub">
            {display}
          </span>
        </p>

        {conversation.messages.length > 0 && (
          <p className="mt-2 w-48 truncate text-xs font-semibold text-black text-opacity-40 dark:text-dark-text-sub">
            {showLastMessage()}
          </p>
        )}
      </div>
    </ItemWrapper>
  )
}

export default ConversationItem
