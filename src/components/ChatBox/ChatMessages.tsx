import classNames from 'classnames'
import { FC, Fragment, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatbot.png'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { useSettings } from 'src/hooks'
import { isAudioProduct } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import Waveform from '../Waveform'
import ChatBubble from './ChatBubble'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'

const ChatMessages: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const loading = useRecoilValue(loadingState)
  const { settings } = useSettings()
  const currProduct = useRecoilValue(currProductState)
  const currConversation = useRecoilValue(currConversationState)
  const hasMessages = currConversation && currConversation.messages.length > 0

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight + 24) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currConversation])

  return (
    <section
      className={classNames(
        'no-scrollbar relative h-[calc(100vh_-_8.25rem)] overflow-y-scroll p-6',
        { 'flex items-center justify-center': !hasMessages }
      )}
      ref={chatBoxRef}
    >
      {hasMessages ? (
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
                {loading && !message.answer ? (
                  <MessageSpinner />
                ) : (
                  <Markdown raw={message.answer} />
                )}
              </ChatBubble>
            </Fragment>
          ))}
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

export default ChatMessages
