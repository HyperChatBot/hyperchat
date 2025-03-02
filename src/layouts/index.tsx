import { useAtomValue } from 'jotai'
import { FC } from 'react'
import Loading from 'src/components/Loading'
import Sidebar from 'src/components/Sidebar'
import Conversation from 'src/containers/Conversation'
import Settings from 'src/containers/Settings'
import { useInitial, useOnline } from 'src/hooks'
import { configurationAtom } from 'src/stores/conversation'
import { settingsAtom } from 'src/stores/global'

const Layouts: FC = () => {
  const configuration = useAtomValue(configurationAtom)
  const settings = useAtomValue(settingsAtom)
  useOnline()
  useInitial()

  if (!configuration || !settings) return <Loading />

  return (
    <section className="flex">
      <Sidebar />
      <Conversation />
      <Settings />
    </section>
  )
}

export default Layouts
