import { enqueueSnackbar } from 'notistack'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import configurations from 'src/configurations'
import { useDB } from 'src/hooks'
import { BAN_ACTIVE_HINT } from 'src/shared/constants'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Conversation } from 'src/types/conversation'
import { v4 } from 'uuid'
import Divider from '../Divider'
import { OutlinePlusIcon } from '../Icons'
import ConversationItem from './ConversationItem'
import ChatEmpty from './EmptyItem'

interface Props {
  conversations: Conversation[]
}

const ConversationList: FC<Props> = ({ conversations }) => {
  const loading = useRecoilValue(loadingState)
  const settings = useRecoilValue(settingsState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )
  const { insertOne } = useDB('conversations')

  const addConversation = async () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }

    const conversation: Conversation = {
      avatar: '',
      id: v4(),
      summary: '',
      messages: [],
      createdAt: +new Date(),
      updatedAt: +new Date(),
      configuration: configurations[settings.company].configuration
    }

    setCurrConversation(conversation)
    insertOne(conversation)
  }

  const switchConversation = (conversation: Conversation) => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    setCurrConversation(conversation)
  }

  return (
    <section className="w-87.75">
      <section className="flex items-center justify-between p-6">
        <span className="mr-4 truncate text-xl font-semibold dark:text-dark-text">
          Hyper Chat
        </span>
        <OutlinePlusIcon onClick={addConversation} />
      </section>

      <Divider />

      <section className="no-scrollbar m-4 h-[calc(100vh_-_7.5625rem)] overflow-y-scroll">
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              active={
                conversation.id === currConversation?.id
              }
              conversation={conversation}
              onClick={() => switchConversation(conversation)}
            />
          ))
        ) : (
          <ChatEmpty onClick={addConversation} />
        )}
      </section>
    </section>
  )
}

export default ConversationList
