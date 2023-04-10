import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import DrawerHeader from './DrawerHeader'
import NotFound from 'src/components/NotFound'
import routes from 'src/router'
import { menuState } from 'src/stores/menu'
import { DRAWER_WIDTH } from 'src/shared/constants'

const Main: FC = () => {
  const [open] = useRecoilState(menuState)
  const theme = useTheme()

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        minHeight: '100vh',
        width: open
          ? `calc(100vw - ${DRAWER_WIDTH}px)`
          : `calc(100vw - ${theme.spacing(8)} - 1px)`
      }}
    >
      <DrawerHeader />
      <Routes>
        {routes.map((route) => {
          const Comp = route.component
          return <Route key={route.path} path={route.path} element={<Comp />} />
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  )
}

export default Main
