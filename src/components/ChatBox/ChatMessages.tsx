import classNames from 'classnames'
import { FC, memo, useEffect, useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatbot.png'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { useSettings } from 'src/hooks'
import { isAudioProduct } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Roles } from 'src/types/conversation'
import { Products } from 'src/types/global'
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
  const hasMessages = useMemo(
    () => currConversation && currConversation.messages.length > 0,
    [currConversation]
  )

  const getBotLogo = (role: Roles) =>
    role === Roles.Assistant
      ? settings?.assistantAvatarFilename
        ? settings.assistantAvatarFilename
        : ChatGPTLogoImg
      : ''

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
            <ChatBubble
              key={message.messageId}
              role={message.role}
              avatar={getBotLogo(message.role)}
              date={message.createdAt}
            >
              {isAudioProduct(currProduct) && message.fileName && (
                <Waveform filename={message.fileName} />
              )}

              {loading && !message.content ? (
                <MessageSpinner />
              ) : message.role === Roles.Assistant ? (
                <Markdown raw={message.content} />
              ) : (
                message.content
              )}
            </ChatBubble>
          ))}

          {loading && currProduct !== Products.ChatCompletion && (
            <ChatBubble
              role={Roles.Assistant}
              avatar={getBotLogo(Roles.Assistant)}
              date={+new Date()}
            >
              <MessageSpinner />
            </ChatBubble>
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

export default memo(ChatMessages)
