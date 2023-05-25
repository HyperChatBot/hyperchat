import Conversation from 'src/containers/Conversation'
import Settings from 'src/containers/Settings'

export const routers = [
  {
    path: '/',
    element: Conversation
  },
  {
    path: '/settings',
    element: Settings
  }
]
