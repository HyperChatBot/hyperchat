import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SnackbarProvider } from 'notistack'
import Loading from 'src/components/Loading'
import { SnackbarUtilsConfigurator } from 'src/components/Toast'
import Layout from './layouts'

const $rootEl = document.getElementById('root') as HTMLElement

ReactDOM.createRoot($rootEl).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <RecoilRoot>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <SnackbarUtilsConfigurator />
            <Layout />
          </BrowserRouter>
        </SnackbarProvider>
      </RecoilRoot>
    </Suspense>
  </StrictMode>
)
