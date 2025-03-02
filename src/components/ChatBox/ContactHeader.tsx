import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { Check, Pencil, Trash } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { FC, KeyboardEvent, memo, useEffect, useState } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'
import { useDB } from 'src/hooks'
import { BAN_ACTIVE_HINT, EMPTY_CHAT_HINT } from 'src/shared/constants'
import {
  avatarPickerVisibleAtom,
  conversationAtom,
  summaryInputVisibleAtom
} from 'src/stores/conversation'
import { loadingAtom, onlineAtom } from 'src/stores/global'
import { EmojiPickerProps } from 'src/types/global'
import { Input } from '../ui/input'

const ContactHeader: FC = () => {
  const { deleteOneById, updateOneById } = useDB()
  const [conversation, setConversation] = useAtom(conversationAtom)
  const [summaryInputVisible, setSummaryInputVisible] = useAtom(
    summaryInputVisibleAtom
  )
  const [avatarPickerVisible, setAvatarPickerVisible] = useAtom(
    avatarPickerVisibleAtom
  )
  const loading = useAtomValue(loadingAtom)
  const online = useAtomValue(onlineAtom)
  const [summaryValue, setSummaryValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (conversation) {
      setSummaryValue(conversation.summary || '')
    }
  }, [conversation])

  const openAvatarPicker = () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    if (!conversation) return
    setAvatarPickerVisible(true)
  }

  const openSummaryInput = () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    if (!conversation) return
    setSummaryValue(conversation?.summary || '')
    setSummaryInputVisible(true)
  }

  const saveSummary = async () => {
    if (summaryValue.trim().length === 0) return

    if (conversation) {
      const changes = {
        summary: summaryValue,
        updatedAt: +new Date()
      }
      await updateOneById(conversation.id, changes)
      setConversation({ ...conversation, ...changes })
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
    if (conversation) {
      const changes = {
        avatar: data.native,
        updatedAt: +new Date()
      }
      await updateOneById(conversation.id, changes)
      setConversation({ ...conversation, ...changes })
      setAvatarPickerVisible(false)
    }
  }

  const deleteCurrConversation = async () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    if (conversation) {
      await deleteOneById(conversation.id)
    }
  }

  const summary = conversation?.summary || EMPTY_CHAT_HINT

  return (
    <section className="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
      <section className="flex items-center">
        <div
          className={classNames(
            'mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
            {
              'bg-gray-200 dark:bg-gray-700': !conversation?.avatar
            }
          )}
          onClick={openAvatarPicker}
        >
          {conversation?.avatar || (
            <img
              src={HyperChatLogo}
              alt="HyperChat Logo"
              className="h-6 w-6 rounded-full"
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {online ? 'Online' : 'Offline'}
            </p>
          </div>

          <div className="flex items-center">
            {summaryInputVisible ? (
              <>
                <Input
                  className="w-60 text-base"
                  value={summaryValue}
                  onChange={(e) => {
                    setSummaryValue(e.target.value)
                    setIsTyping(true)
                    setTimeout(() => setIsTyping(false), 500)
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    setSummaryInputVisible(false)
                  }}
                  autoFocus
                />
                <Check
                  className="h-4 w-4 cursor-pointer"
                  onClick={saveSummary}
                />
              </>
            ) : (
              <div
                className="flex cursor-pointer items-center"
                onClick={openSummaryInput}
              >
                <p className="mr-4 text-base">{summary}</p>
                {!!conversation && (
                  <Pencil className="h-4 w-4 cursor-pointer" />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={deleteCurrConversation}
      >
        <Trash className="h-4 w-4 cursor-pointer" />
      </section>
    </section>
  )
}

export default memo(ContactHeader)
