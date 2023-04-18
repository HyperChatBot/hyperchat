import Embeddings from 'src/containers/Embeddings'
import Main from 'src/containers/Main'
import Settings from 'src/containers/Settings'

export const routers = [
  {
    path: '/',
    element: Main
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
