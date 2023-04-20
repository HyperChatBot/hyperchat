import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Siderbar from 'src/components/Sidebar'
import { useCollection, useOnline } from 'src/hooks'
import { routers } from 'src/routers'
import { ChatDocument } from 'src/schemas/chatSchema'
import { conversationsState, currConversationIdState } from 'src/stores/conversation'
import { Conversation } from 'src/types/conversation'

const Layouts = () => {
  const location = useLocation()
  const chatCollection = useCollection('chat')
  const setChats = useSetRecoilState(conversationsState)
  const setCurrChat = useSetRecoilState(currConversationIdState)
  useOnline()

  const getChatData = async () => {
    const res: ChatDocument[] = await chatCollection
      .find({
        sort: [{ updated_at: 'desc' }]
      })
      .exec()

    setChats(res.map((data) => data.toJSON()) as Conversation[])
    setCurrChat(res[0]?.conversation_id || '')
  }

  useEffect(() => {
    getChatData()
  }, [])

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
