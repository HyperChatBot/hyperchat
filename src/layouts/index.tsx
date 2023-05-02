import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ErrorAlert from 'src/components/ErrorAlert'
import Sidebar from 'src/components/Sidebar'
import { useOnline } from 'src/hooks'
import { db } from 'src/models/db'
import { routers } from 'src/routers'
import {
  conversationsState,
  currConversationIdState
} from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'

const Layouts = () => {
  const currProduct = useRecoilValue(currProductState)
  const setConversations = useSetRecoilState(conversationsState)
  const setCurrConversationId = useSetRecoilState(currConversationIdState)
  useOnline()

  const getConversationData = async () => {
    const data = await db.chat.toArray()
    data.sort((a, b) => b.updated_at - a.updated_at)

    setConversations(data)
    setCurrConversationId(data[0]?.conversation_id || '')
  }

  useEffect(() => {
    getConversationData()
  }, [currProduct])

  return (
    <div className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
      <Sidebar />
      <Routes>
        {routers.map((router) => (
          <Route
            key={router.path}
            path={router.path}
            element={<router.element />}
          />
        ))}
      </Routes>
      <ErrorAlert />
    </div>
  )
}

export default Layouts
