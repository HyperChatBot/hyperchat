import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import Loading from './components/Loading'
import Layouts from './layouts'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <RecoilRoot>
        <Layouts />
      </RecoilRoot>
    </Suspense>
  </StrictMode>
)
