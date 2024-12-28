import { enqueueSnackbar } from 'notistack'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useDB } from 'src/hooks'
import { BAN_ACTIVE_HINT } from 'src/shared/constants'
import { conversationState } from 'src/stores/conversation'
import { companyState, loadingState } from 'src/stores/global'
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
  const company = useRecoilValue(companyState)
  const [currentConversation, setConversation] =
    useRecoilState(conversationState)
  const { insertOne } = useDB('conversations')

  const addConversation = async () => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }

    const defaultConversation: Conversation = {
      avatar: '',
      id: v4(),
      summary: '',
      messages: [],
      createdAt: +new Date(),
      updatedAt: +new Date(),
      company
    }

    await insertOne(defaultConversation)
    setConversation(defaultConversation)
  }

  const switchConversation = (conversation: Conversation) => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    setConversation(conversation)
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
              active={conversation.id === currentConversation?.id}
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
