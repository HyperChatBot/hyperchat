import { Route, Routes } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar'
import { useOnline } from 'src/hooks'
import { routers } from 'src/routers'

const Layouts = () => {
  useOnline()

  return (
    <div className="container flex w-screen flex-row overflow-x-hidden dark:bg-gray-800">
      <Sidebar />
      <Routes>
        {routers.map((router) => (
          <Route
            key={router.path}
            path={router.path}
            element={<router.element />}
          />
        ))}
      </Routes>
    </div>
  )
}

export default Layouts
