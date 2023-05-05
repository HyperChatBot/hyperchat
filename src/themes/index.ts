import { createTheme } from '@mui/material/styles'
import { ThemeMode } from 'src/types/global'

const theme = (theme: Exclude<ThemeMode, 'system'>) =>
  createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#615ef0'
      }
    },
    typography: {
      button: {
        textTransform: 'none'
      }
    },
    shape: {
      borderRadius: 8
    }
  })

export default theme
