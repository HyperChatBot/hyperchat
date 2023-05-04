import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { db } from 'src/models/db'
import Layouts from './layouts'
import './styles.css'

await db.setDefaultSettings()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <Layouts />
    </RecoilRoot>
  </StrictMode>
)
