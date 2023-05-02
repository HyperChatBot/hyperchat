import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Layouts from './layouts'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Layouts />
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
)
