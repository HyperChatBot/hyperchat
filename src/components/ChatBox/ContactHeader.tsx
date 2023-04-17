import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/react'
import classNames from 'classnames'
import { FC, KeyboardEvent, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import { useModifyDocument } from 'src/hooks'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import { currChatState, summaryInputVisibleState } from 'src/stores/chat'
import { onlineState } from 'src/stores/global'
import Avatar from '../Avatar'

const ContractHeader: FC = () => {
  const [summaryInputVisible, setSummaryInputVisibleState] = useRecoilState(
    summaryInputVisibleState
  )
  const [currChat, setCurrChat] = useRecoilState(currChatState)
  const isOnline = useRecoilValue(onlineState)
  const [summaryValue, setSummaryValue] = useState(currChat?.summary || '')
  const summary = currChat?.summary || currChat?.chat_id || EMPTY_CHAT_HINT
  const { modifyDocument } = useModifyDocument('chat')

  const saveSummary = () => {
    if (summaryValue.trim().length === 0) return

    if (currChat) {
      setCurrChat({ ...currChat, summary: summaryValue })

      modifyDocument(
        {
          // @ts-ignore
          chat_id: currChat.chat_id
        },
        {
          summary: summaryValue
        }
      )

      setSummaryInputVisibleState(false)
    }
  }

  const saveSummaryWithKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSummaryInputVisibleState(false)
    }

    if (e.key === 'Enter') {
      saveSummary()
    }
  }

  useEffect(() => {
    setSummaryInputVisibleState(false)
  }, [currChat])

  return (
    <section className="flex items-start justify-between pb-5 pl-6 pr-6 pt-5">
      <section className="flex items-center">
        <Avatar size="xs" src={ChatGPTLogoImg} />
        <section className="ml-4 flex flex-col">
          <div className="mb-2 flex items-center font-semibold text-black dark:text-dark-text">
            {summaryInputVisible ? (
              <>
                <Input
                  width={400}
                  className="mr-4"
                  autoFocus
                  onKeyUp={saveSummaryWithKeyboard}
                  onChange={(e) => setSummaryValue(e.target.value)}
                  variant="flushed"
                  size="xs"
                />
                <CheckIcon
                  className="cursor-pointer fill-current text-black dark:text-dark-text"
                  onClick={saveSummary}
                />
              </>
            ) : (
              <div
                onClick={() => setSummaryInputVisibleState(true)}
                className="flex cursor-pointer items-center"
              >
                <p className="mr-4 text-base">{summary}</p>
                <EditIcon className="fill-current text-black dark:text-dark-text" />
              </div>
            )}
          </div>

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
