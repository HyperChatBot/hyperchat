import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar'
import Conversation from 'src/containers/Conversation'
import Settings from 'src/containers/Settings'
import { useOnline, useTheme } from 'src/hooks'
import {
  SNACKBAR_ANCHOR_ORIGIN,
  SNACKBAR_AUTO_HIDE_DURATION,
  SNACKBAR_MAX_NUM
} from 'src/shared/constants'

const Layouts: FC = () => {
  const { muiTheme } = useTheme()
  useOnline()

  return (
    <ThemeProvider theme={muiTheme}>
      <SnackbarProvider
        maxSnack={SNACKBAR_MAX_NUM}
        anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        preventDuplicate
        hideIconVariant
        style={{
          maxWidth: 500
        }}
      >
        <section className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
          <BrowserRouter>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Conversation />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </section>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default Layouts
