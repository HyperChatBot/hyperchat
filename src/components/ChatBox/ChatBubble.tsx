import classNames from 'classnames'
import { DateTime } from 'luxon'
import { FC, ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import MP3 from 'src/assets/小星星.mp3'
import Waveform from 'src/components/Waveform'
import { currProductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import Avatar from '../Avatar'

interface Props {
  role: 'assistant' | 'user'
  avatar: string
  children: ReactNode
  date: number
}

const ChatBubble: FC<Props> = ({ role, avatar, date, children }) => {
  const currProduct = useRecoilValue(currProductState)
  return (
    <section
      className={classNames('group mb-8 flex items-start', {
        'flex-row-reverse': role === 'user'
      })}
    >
      {role === 'assistant' && (
        <Avatar
          src={avatar}
          className={classNames({
            'mr-4': role === 'assistant'
          })}
        />
      )}

      <section
        className={classNames('flex flex-col', {
          'items-start': role === 'assistant',
          'items-end': role === 'user'
        })}
      >
        <section
          className={classNames('max-w-160 rounded-2xl p-4 text-sm', {
            'rounded-tl-none bg-main-gray text-black dark:bg-gray-700 dark:text-dark-bubble-assistant-text':
              role === 'assistant',
            'flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap break-words rounded-br-none bg-main-purple text-white ':
              role === 'user',
          })}
        >
          <Waveform audio={MP3} />
          {children}
        </section>
        <p
          className={
            'mt-2 text-xs text-black text-opacity-30 opacity-0 transition duration-250 ease-in-out group-hover:opacity-100 group-hover:duration-250 dark:text-dark-bubble-assistant-text dark:text-opacity-30'
          }
        >
          {DateTime.fromMillis(date).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS
          )}
        </p>
      </section>
    </section>
  )
}

export default ChatBubble
