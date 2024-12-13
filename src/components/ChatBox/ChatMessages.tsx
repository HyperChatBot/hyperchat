import classNames from 'classnames'
import { ChatCompletionContentPartText } from 'openai/resources'
import { FC, memo, useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { isSupportAudio } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Message, Roles } from 'src/types/conversation'
import { Products } from 'src/types/global'
import Waveform from '../Waveform'
import ChatBubble from './ChatBubble'
import Markdown from './Markdown'
import MessageSpinner from './MessageSpinner'

const ChatMessages: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const loading = useRecoilValue(loadingState)
  const currProduct = useRecoilValue(currProductState)
  const currConversation = useRecoilValue(currConversationState)
  const hasMessages = useMemo(
    () => currConversation && currConversation.messages.length > 0,
    [currConversation?.messages?.length]
  )

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

  const getAudioFilename = (message: Message) => {
    if (isSupportAudio(currProduct) && message.content[0].type === 'audio') {
      return message.content[0].audioUrl.url
    }

    return ''
  }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [currConversation])

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
            <ChatBubble key={message.messageId} message={message}>
              {getAudioFilename(message) ? (
                <>
                  <Waveform filename={getAudioFilename(message)} />
                  {message.content}
                </>
              ) : (
                <>
                  {loading && !message.content ? (
                    <MessageSpinner />
                  ) : message.role === Roles.Assistant ? (
                    <Markdown
                      raw={
                        (message.content as ChatCompletionContentPartText[])[0]
                          .text
                      }
                    />
                  ) : (
                    <div>
                      {message.content.map((item, key) => {
                        if (item.type === 'image_url') {
                          return (
                            <img
                              src={item.image_url.url}
                              key={key}
                              className="mb-2 max-w-80"
                            />
                          )
                        }

                        if (item.type === 'text') {
                          return <p key={key}>{item.text}</p>
                        }
                      })}
                    </div>
                  )}
                </>
              )}
            </ChatBubble>
          ))}

          {loading && currProduct !== Products.ChatCompletion && (
            <ChatBubble
              message={{
                messageId: '$$placeholder',
                role: Roles.Assistant,
                content: [],
                tokensCount: 0,
                createdAt: +new Date()
              }}
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
