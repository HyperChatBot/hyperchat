import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { db } from 'src/models/db'
import { SnackbarUtilsConfig } from './components/Snackbar'
import Layouts from './layouts'
import {
  SNACKBAR_ANCHOR_ORIGIN,
  SNACKBAR_AUTO_HIDE_DURATION,
  SNACKBAR_MAX_NUM
} from './shared/constants'
import './styles.css'
import theme from './themes'

await db.setDefaultSettings()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={SNACKBAR_MAX_NUM}
            anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
            autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
            preventDuplicate
          >
            <SnackbarUtilsConfig />
            <Layouts />
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
)
