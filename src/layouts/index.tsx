import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Siderbar from 'src/components/Sidebar'
import { useCollection, useOnline } from 'src/hooks'
import { routers } from 'src/routers'
import { ChatDocument } from 'src/schemas/chatSchema'
import { schemaNames } from 'src/shared/constants'
import {
  conversationsState,
  currConversationIdState
} from 'src/stores/conversation'
import { currPruductState } from 'src/stores/global'
import { Conversation } from 'src/types/conversation'

const Layouts = () => {
  const currPruduct = useRecoilValue(currPruductState)
  const conversationCollection = useCollection(schemaNames[currPruduct])
  const setConversations = useSetRecoilState(conversationsState)
  const setCurrConversationId = useSetRecoilState(currConversationIdState)
  useOnline()

  const getConversationData = async () => {
    const res: ChatDocument[] = await conversationCollection
      .find({
        sort: [{ updated_at: 'desc' }]
      })
      .exec()

    setConversations(res.map((data) => data.toJSON()) as Conversation[])
    setCurrConversationId(res[0]?.conversation_id || '')
  }

  useEffect(() => {
    getConversationData()
  }, [currPruduct])

  return (
    <div className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
      <Siderbar />
      <Routes>
        {routers.map((router) => (
          <Route
            key={router.path}
            path={router.path}
            element={<router.element />}
          />
        ))}
      </Routes>
    </div>
  )
}

export default Layouts
