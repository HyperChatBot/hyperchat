import { lazy } from 'react'
import ChatIcon from '@mui/icons-material/Chat'
import { Roles } from 'src/types/user'

const ChatGPT = lazy(() => import('src/containers'))

const routes = [
  {
    key: ' chatGPT',
    icon: ChatIcon,
    label: 'ChatGPT',
    path: '/',
    component: ChatGPT,
    roles: [Roles.ADMIN]
  }
]

export default routes
