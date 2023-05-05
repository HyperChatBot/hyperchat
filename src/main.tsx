import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import Layouts from './layouts'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <Layouts />
    </RecoilRoot>
  </StrictMode>
)
