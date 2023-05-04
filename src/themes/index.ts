import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
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
