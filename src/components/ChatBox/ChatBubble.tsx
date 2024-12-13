import classNames from 'classnames'
import { FC, memo, ReactNode } from 'react'
import ChatGPTLogoImg from 'src/assets/chatbot.png'
import { useSettings } from 'src/hooks'
import { Message, Roles } from 'src/types/conversation'
import Avatar from '../Avatar'
import ToolsBox from './ToolsBox'

interface Props {
  message: Message
  children: ReactNode
}

const ChatBubble: FC<Props> = ({ message, children }) => {
  const { settings } = useSettings()
  const getBotLogo = (role: Roles) =>
    role === Roles.Assistant
      ? settings?.assistantAvatarFilename
        ? settings.assistantAvatarFilename
        : ChatGPTLogoImg
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
        <section
          className={classNames('max-w-160 rounded-2xl p-4 text-sm', {
            'rounded-tl-none bg-main-gray text-black dark:bg-gray-700 dark:text-dark-bubble-assistant-text':
              message.role === Roles.Assistant,
            'flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap break-words rounded-br-none bg-main-purple text-white':
              message.role === Roles.User
          })}
        >
          {children}
        </section>
        <ToolsBox message={message} />
      </section>
    </section>
  )
}

export default memo(
  ChatBubble,
  (prevProps, nextProps) => prevProps.children === nextProps.children
)
