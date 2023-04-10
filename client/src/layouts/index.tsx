import { FC } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import useThemeMode from 'src/hooks/useThemeMode'
import Menu from './Menu'
import Header from './Header'
import Main from './Main'

const Layout: FC = () => {
  const { themeMode } = useThemeMode()

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: themeMode
        }
      })}
    >
      <CssBaseline />
        <Main />
    </ThemeProvider>
  )
}

export default Layout
