import { DeleteIcon } from '@chakra-ui/icons'
import classNames from 'classnames'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import { currChatState } from 'src/stores/chat'
import { onlineState } from 'src/stores/global'
import Avatar from '../Avatar'

const ContractHeader: FC = () => {
  const currChat = useRecoilValue(currChatState)
  const isOnline = useRecoilValue(onlineState)

  const title = currChat?.summary || currChat?.chat_id || EMPTY_CHAT_HINT

  return (
    <section className="flex items-start justify-between pb-5 pl-6 pr-6 pt-5">
      <section className="flex items-center">
        <Avatar size="xs" src={ChatGPTLogoImg} />
        <section className="ml-4 flex flex-col">
          <p className="text-xl font-semibold text-black dark:text-dark-text">
            {title}
          </p>

          <p className="flex items-center">
            <span
              className={classNames('mr-2 h-2.5 w-2.5 rounded-full ', {
                'bg-red-500': !isOnline,
                'bg-status-green': isOnline
              })}
            />
            <span className="text-xs font-semibold text-black  text-opacity-60 dark:text-dark-text-sub">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </p>
        </section>
      </section>
      {currChat && (
        <section className="flex cursor-pointer rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple">
          <DeleteIcon w={6} h={6} />
        </section>
      )}
    </section>
  )
}

export default ContractHeader
