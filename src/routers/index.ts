import ChatCompletion from 'src/containers/ChatCompletion'
import Embeddings from 'src/containers/Embeddings'
import Settings from 'src/containers/Settings'

export const routers = [
  {
    path: '/',
    element: ChatCompletion
  },
  {
    path: '/embeddings',
    element: Embeddings
  },
  {
    path: 'settings',
    element: Settings
  }
]
