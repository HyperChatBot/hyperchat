import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import { Tooltip } from 'flowbite-react'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import LogoImg from 'src/assets/Logo.png'
import { currProductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import Avatar from '../Avatar'
import items, { iconClassName } from './Items'

const Sidebar: FC = () => {
  const [currProduct, setCurrProduct] = useRecoilState(currProductState)
  const location = useLocation()

  const setProduct = (product: Products) => {
    window.localStorage.setItem('currProductState', product)
    setCurrProduct(product)
  }

  return (
    <section className="flex h-screen w-22 min-w-22 flex-col items-center justify-between p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={LogoImg} />
        <section className="mt-12">
          {items.map((item, key) => (
            <div key={key} className="mb-8">
              <Tooltip content={item.tooltip} placement="right">
                <Link
                  to="/"
                  className="cursor-pointer"
                  onClick={() => setProduct(item.product)}
                >
                  {currProduct === item.product && location.pathname === '/'
                    ? item.active
                    : item.inactive}
                </Link>
              </Tooltip>
            </div>
          ))}

          <div className="mb-8">
            <Tooltip content="Settings" placement="right">
              <Link to="/settings">
                {location.pathname === '/settings' ? (
                  <Cog6ToothIconSolid className={iconClassName} />
                ) : (
                  <Cog6ToothIconOutline className={iconClassName} />
                )}
              </Link>
            </Tooltip>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Sidebar
