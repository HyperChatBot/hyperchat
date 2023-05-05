import classNames from 'classnames'
import { FC, Fragment, RefObject } from 'react'
import { useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { useSettings } from 'src/hooks'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import { isAudioProduct } from 'src/shared/utils'
import { tempMessageState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import Waveform from '../Waveform'
import ChatBubble from './ChatBubble'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'

interface Props {
  currConversation?: Conversation
  chatBoxRef: RefObject<HTMLDivElement>
}

const ChatList: FC<Props> = ({ currConversation, chatBoxRef }) => {
  const { settings } = useSettings()
  const currProduct = useRecoilValue(currProductState)
  const tempMessage = useRecoilValue(tempMessageState)
  const hasMessages = currConversation && currConversation.messages.length > 0

  return (
    <section
      className={classNames(
        'no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6',
        { 'flex items-center justify-center': !(hasMessages || tempMessage) }
      )}
      ref={chatBoxRef}
    >
      {hasMessages || tempMessage ? (
        <>
          {currConversation?.messages.map((message) => (
            <Fragment key={message.message_id}>
              <ChatBubble
                role="user"
                avatar=""
                date={message.question_created_at}
              >
                {isAudioProduct(currProduct) && message.file_name && (
                  <Waveform filename={message.file_name} />
                )}
                {message.question}
              </ChatBubble>
              <ChatBubble
                role="assistant"
                avatar={
                  settings?.assistant_avatar_filename
                    ? settings.assistant_avatar_filename
                    : ChatGPTLogoImg
                }
                date={message.answer_created_at}
              >
                <Markdown raw={message.answer} />
              </ChatBubble>
            </Fragment>
          ))}

          {tempMessage && (
            <>
              <ChatBubble
                role="user"
                avatar=""
                date={tempMessage.question_created_at}
              >
                {isAudioProduct(currProduct) && tempMessage?.file_name && (
                  <Waveform filename={tempMessage.file_name} />
                )}
                {tempMessage.question}
              </ChatBubble>
              <ChatBubble
                role="assistant"
                avatar={
                  settings?.assistant_avatar_filename
                    ? settings.assistant_avatar_filename
                    : ChatGPTLogoImg
                }
                date={tempMessage.answer_created_at}
              >
                {tempMessage.message_id === EMPTY_MESSAGE_ID ? (
                  <MessageSpinner />
                ) : (
                  <Markdown raw={tempMessage.answer} />
                )}
              </ChatBubble>
            </>
          )}
        </>
      ) : (
        <img
          src={NoDataIllustration}
          alt="NoDataIllustration"
          className="h-96 w-96 dark:opacity-80"
        />
      )}
    </section>
  )
}

export default ChatList
