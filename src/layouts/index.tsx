import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InitialDialog from 'src/components/InitialDialog'
import Loading from 'src/components/Loading'
import { SnackbarUtilsConfig } from 'src/components/Snackbar'
import { useOnline, useTheme } from 'src/hooks'
import { routers } from 'src/routers'
import {
  SNACKBAR_ANCHOR_ORIGIN,
  SNACKBAR_AUTO_HIDE_DURATION,
  SNACKBAR_MAX_NUM
} from 'src/shared/constants'

const Sidebar = lazy(() => import('src/components/Sidebar'))

const Layouts: FC = () => {
  const { muiTheme } = useTheme()
  useOnline()

  return (
    <Suspense fallback={<Loading />}>
      <ThemeProvider theme={muiTheme}>
        <SnackbarProvider
          maxSnack={SNACKBAR_MAX_NUM}
          anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
          autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
          preventDuplicate
        >
          <SnackbarUtilsConfig />

          <section className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
            <BrowserRouter>
            <InitialDialog />
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
            </BrowserRouter>
          </section>
        </SnackbarProvider>
      </ThemeProvider>
    </Suspense>
  )
}

export default Layouts
