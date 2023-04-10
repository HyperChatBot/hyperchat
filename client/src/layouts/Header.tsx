import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { DRAWER_WIDTH } from 'src/shared/constants'
import { menuState } from 'src/stores/menu'
import useThemeMode from 'src/hooks/useThemeMode'

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const ThemeModeToggle = styled('div')(() => ({
  cursor: 'pointer'
}))

const Header: FC = () => {
  const [open, setMenuState] = useRecoilState(menuState)
  const { themeMode, toggleThemeMode } = useThemeMode()

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setMenuState(true)}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Learn React
        </Typography>

        <ThemeModeToggle onClick={toggleThemeMode}>
          {themeMode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
        </ThemeModeToggle>
      </Toolbar>
    </AppBar>
  )
}

export default Header
