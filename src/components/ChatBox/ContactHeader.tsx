import classNames from 'classnames'
import { FC, KeyboardEvent, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import { db } from 'src/models/db'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import { summaryInputVisibleState } from 'src/stores/conversation'
import { currProductState, onlineState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'
import Avatar from '../Avatar'
import { LinearCheckIcon, LinearDeleteIcon, LinearEditIcon } from '../Icons'

interface Props {
  currConversation?: Conversation
}

const ContactHeader: FC<Props> = ({ currConversation }) => {
  const currProduct = useRecoilValue(currProductState)
  const [summaryInputVisible, setSummaryInputVisibleState] = useRecoilState(
    summaryInputVisibleState
  )

  const isOnline = useRecoilValue(onlineState)
  const [summaryValue, setSummaryValue] = useState(
    currConversation?.summary || ''
  )
  const summary =
    currConversation?.summary ||
    currConversation?.conversation_id ||
    EMPTY_CHAT_HINT

  const saveSummary = async () => {
    if (summaryValue.trim().length === 0) return

    if (currConversation) {
      await db[currProduct].update(currConversation.conversation_id, {
        summary: summaryValue
      })

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
  }, [currConversation])

  return (
    <section className="flex items-start justify-between pb-5 pl-6 pr-6 pt-5">
      <section className="flex items-center">
        <Avatar size="xs" src={ChatGPTLogoImg} />
        <section className="ml-4 flex flex-col">
          <div className="mb-1 flex items-center font-semibold text-black dark:text-dark-text">
            {summaryInputVisible ? (
              <>
                <input
                  type="text"
                  autoFocus
                  onKeyUp={saveSummaryWithKeyboard}
                  onChange={(e) => setSummaryValue(e.target.value)}
                  className="w-96 border-b-2 border-l-0 border-r-0 border-t-0 border-main-purple p-0 focus:border-b-2 focus:border-main-purple focus:ring-0 dark:bg-gray-800"
                ></input>
                <LinearCheckIcon
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
                <LinearEditIcon className="h-4 w-4" />
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
            <span className="text-xs font-semibold text-black text-opacity-60 dark:text-dark-text-sub">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </p>
        </section>
      </section>
      {currConversation && (
        <section className="flex cursor-pointer rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple">
          <LinearDeleteIcon className="h-4 w-4" />
        </section>
      )}
    </section>
  )
}

export default ContactHeader
