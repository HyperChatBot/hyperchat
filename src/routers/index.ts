import { lazy } from 'react'

const Conversation = lazy(() => import('src/containers/Conversation'))
const Settings = lazy(() => import('src/containers/Settings'))

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
