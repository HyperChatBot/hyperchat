import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { initialDB } from 'src/db'
import Layouts from './layouts'
import './styles.css'

await initialDB()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Layouts />
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
)
