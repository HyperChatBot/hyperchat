import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { FC, memo } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'
import { customBotAvatarUrlAtom } from 'src/stores/global'
import {
  ContentPartType,
  Message,
  Roles,
  TextPrompt
} from 'src/types/conversation'
import Avatar from '../Avatar'
import { Card } from '../ui/card'
import Markdown from './Markdown'
import ToolsBox from './ToolsBox'

interface Props {
  message: Message
}

const ChatBubble: FC<Props> = ({ message }) => {
  const customBotAvatarUrl = useAtomValue(customBotAvatarUrlAtom)

  const getBotLogo = (role: Roles) =>
    role === Roles.Assistant
      ? customBotAvatarUrl
        ? customBotAvatarUrl
        : HyperChatLogo
      : ''

  return (
    <section
      className={classNames('group mb-8 flex items-start', {
        'flex-row-reverse': message.role === Roles.User
      })}
    >
      {message.role === Roles.Assistant && (
        <Avatar
          src={getBotLogo(message.role)}
          className={classNames({
            'mr-4': message.role === Roles.Assistant
          })}
        />
      )}

      <section
        className={classNames('flex flex-col', {
          'items-start': message.role === Roles.Assistant,
          'items-end': message.role === Roles.User
        })}
      >
        <Card
          className={classNames(
            'max-w-160 rounded-2xl p-4 text-sm text-black dark:text-white',
            { 'break-words whitespace-pre-wrap': message.role === Roles.User }
          )}
        >
          {message.role === Roles.Assistant && (
            <Markdown src={(message.content as TextPrompt[])[0].text} />
          )}

          {message.role === Roles.User && (
            <div>
              {message.content.map((item, key) => {
                if (item.type === ContentPartType.TextPrompt) {
                  return <p key={key}>{item.text}</p>
                }

                if (
                  item.type === ContentPartType.Base64FilePromptType &&
                  item.mimeType.includes('image')
                ) {
                  return (
                    <img src={item.data} key={key} className="mb-2 max-w-80" />
                  )
                }

                if (
                  item.type === ContentPartType.UrlFileUrlPromptType &&
                  item.mimeType.includes('image')
                ) {
                  return (
                    <img src={item.url} key={key} className="mb-2 max-w-80" />
                  )
                }

                if (
                  item.type === ContentPartType.Base64FilePromptType &&
                  item.mimeType.includes('audio')
                ) {
                  return <audio src={item.data} key={key} controls />
                }

                if (
                  item.type === ContentPartType.UrlFileUrlPromptType &&
                  item.mimeType.includes('audio')
                ) {
                  return <audio src={item.url} key={key} controls />
                }

                if (
                  item.type === ContentPartType.Base64FilePromptType &&
                  item.mimeType.includes('video')
                ) {
                  return <video src={item.data} key={key} controls />
                }

                if (
                  item.type === ContentPartType.UrlFileUrlPromptType &&
                  item.mimeType.includes('video')
                ) {
                  return <video src={item.url} key={key} controls />
                }

                return <div key={key}>File: {item.name}</div>
              })}
            </div>
          )}
        </Card>
        <ToolsBox message={message} />
      </section>
    </section>
  )
}

export default memo(ChatBubble)
