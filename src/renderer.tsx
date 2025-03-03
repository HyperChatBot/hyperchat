/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { Provider, useAtomValue } from 'jotai'
import { FC, StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import Conversation from 'src/components/Conversation'
import Loading from 'src/components/Loading'
import Settings from 'src/components/Settings'
import Sidebar from 'src/components/Sidebar'
import { useInitial, useOnline } from 'src/hooks'
import { configurationAtom } from 'src/stores/conversation'
import { settingsAtom } from 'src/stores/global'
import './assets/styles/index.css'

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider>
      <Layouts />
    </Provider>
  </StrictMode>
)
