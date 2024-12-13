import classNames from 'classnames'
import { FC, memo, useEffect, useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { isSupportAudio } from 'src/shared/utils'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Message } from 'src/types/conversation'
import ChatBubble from './ChatBubble'

const ChatMessages: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
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
            <ChatBubble key={message.messageId} message={message}></ChatBubble>
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

export default memo(ChatMessages)
