import classNames from 'classnames'
import { FC, Fragment, RefObject } from 'react'
import { useRecoilValue } from 'recoil'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import { currConversationState } from 'src/stores/conversation'
import ChatBubble from './ChatBubble'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'

interface Props {
  chatBoxRef: RefObject<HTMLDivElement>
}

const ConversationBox: FC<Props> = ({ chatBoxRef }) => {
  const currConversation = useRecoilValue(currConversationState)
  const hasMessages = currConversation && currConversation.messages.length > 0

  return (
    <section
      className={classNames(
        'no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6',
        { 'flex items-center justify-center': !hasMessages }
      )}
      ref={chatBoxRef}
    >
      {hasMessages ? (
        <>
          {currConversation.messages.map((message) => (
            <Fragment key={message.message_id}>
              <ChatBubble
                role="user"
                avatar=""
                date={message.question_created_at}
              >
                {message.question}
              </ChatBubble>
              <ChatBubble
                role="assistant"
                avatar={''}
                date={message.answer_created_at}
              >
                {message.message_id === EMPTY_MESSAGE_ID ? (
                  <MessageSpinner />
                ) : (
                  <Markdown content={message.answer} />
                )}
              </ChatBubble>
            </Fragment>
          ))}
        </>
      ) : (
        <img
          src={NoDataIllustration}
          alt="NoDataIllustration"
          className="h-96 w-96 dark:opacity-50"
        />
      )}
    </section>
  )
}

export default ConversationBox
