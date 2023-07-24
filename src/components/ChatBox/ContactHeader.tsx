import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/solid'
import Input from '@mui/material/Input'
import classNames from 'classnames'
import { FC, KeyboardEvent, memo, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatbot.png'
import { useDB } from 'src/hooks'
import { BAN_ACTIVE_HINT, EMPTY_CHAT_HINT } from 'src/shared/constants'
import {
  avatarPickerVisibleState,
  currConversationState,
  loadingState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { configurationDrawerVisibleState, onlineState } from 'src/stores/global'
import { EmojiPickerProps } from 'src/types/global'
import Avatar from '../Avatar'
import EmojiPicker from '../EmojiPicker'
import toast from '../Snackbar'

const ContactHeader: FC = () => {
  const loading = useRecoilValue(loadingState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )
  const [summaryInputVisible, setSummaryInputVisible] = useRecoilState(
    summaryInputVisibleState
  )
  const [avatarPickerVisible, setAvatarPickerVisible] = useRecoilState(
    avatarPickerVisibleState
  )
  const isOnline = useRecoilValue(onlineState)
  const setConfigurationDrawerVisible = useSetRecoilState(
    configurationDrawerVisibleState
  )
  const [isTyping, setIsTyping] = useState(false)
  const [summaryValue, setSummaryValue] = useState(
    currConversation?.summary || ''
  )
  const { updateOneById, deleteOneById } = useDB('conversations')

  const summary =
    currConversation?.summary ||
    currConversation?.conversationId ||
    EMPTY_CHAT_HINT

  const openAvatarPicker = () => {
    if (loading) {
      toast.warning(BAN_ACTIVE_HINT)
      return
    }
    setAvatarPickerVisible(true)
  }

  const openSummaryInput = () => {
    if (loading) {
      toast.warning(BAN_ACTIVE_HINT)
      return
    }
    if (!currConversation) return
    setSummaryValue(currConversation?.summary || '')
    setSummaryInputVisible(true)
  }

  const openConfigurationDrawer = () => {
    if (loading) {
      toast.warning(BAN_ACTIVE_HINT)
      return
    }
    setConfigurationDrawerVisible(true)
  }

  const saveSummary = async () => {
    if (summaryValue.trim().length === 0) return

    if (currConversation) {
      const changes = {
        summary: summaryValue,
        updatedAt: +new Date()
      }
      await updateOneById(currConversation.conversationId, changes)
      setCurrConversation({ ...currConversation, ...changes })
      setSummaryInputVisible(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      e.preventDefault()
      saveSummary()
    }
  }

  const saveAvatar = async (data: EmojiPickerProps) => {
    if (currConversation) {
      const changes = {
        avatar: data.native,
        updatedAt: +new Date()
      }
      await updateOneById(currConversation.conversationId, changes)
      setCurrConversation({ ...currConversation, ...changes })
      setAvatarPickerVisible(false)
    }
  }

  const deleteCurrConversation = async () => {
    if (loading) {
      toast.warning(BAN_ACTIVE_HINT)
      return
    }
    if (currConversation) {
      await deleteOneById(currConversation.conversationId)
    }
  }

  useEffect(() => {
    setSummaryInputVisible(false)
    setAvatarPickerVisible(false)
  }, [currConversation])

  return (
    <section className="relative flex items-start justify-between pb-5 pl-6 pr-6 pt-5">
      <section className="flex cursor-pointer items-center">
        {currConversation?.avatar ? (
          <div
            className="flex items-center justify-center text-5xl"
            onClick={openAvatarPicker}
          >
            {currConversation?.avatar}
          </div>
        ) : (
          <Avatar size="xs" src={ChatGPTLogoImg} onClick={openAvatarPicker} />
        )}

        {avatarPickerVisible && <EmojiPicker onEmojiSelect={saveAvatar} />}

        <section className="ml-4 flex flex-col">
          <div className="mb-1 flex items-center font-semibold text-black dark:text-dark-text">
            {summaryInputVisible ? (
              <>
                <Input
                  autoFocus
                  value={summaryValue}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSummaryValue(e.target.value)}
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                  className="w-80"
                  sx={{
                    '.MuiInput-input': {
                      padding: 0
                    }
                  }}
                />
                <CheckIcon className="h-4 w-4" onClick={saveSummary} />
              </>
            ) : (
              <div
                onClick={openSummaryInput}
                className="flex cursor-pointer items-center"
              >
                <p className="mr-4 text-base">{summary}</p>
                {!!currConversation && <PencilSquareIcon className="h-4 w-4" />}
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
        <section className="flex flex-row gap-2">
          <section
            className="flex cursor-pointer rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple"
            onClick={deleteCurrConversation}
          >
            <TrashIcon className="h-4 w-4" />
          </section>
          <section
            className="flex cursor-pointer rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple"
            onClick={openConfigurationDrawer}
          >
            <AdjustmentsVerticalIcon className="h-4 w-4" />
          </section>
        </section>
      )}
    </section>
  )
}

export default memo(ContactHeader)
