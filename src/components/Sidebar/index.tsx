import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import Tooltip from '@mui/material/Tooltip'
import { FC, MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import LogoImg from 'src/assets/chatbot.png'
import { useSettings } from 'src/hooks'
import { db } from 'src/models/db'
import { checkApiKey } from 'src/shared/utils'
import { currConversationState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Companies, Products } from 'src/types/global'
import { Settings } from 'src/types/settings'
import Avatar from '../Avatar'
import Divider from '../Divider'
import toast from '../Snackbar'
import items, { iconClassName } from './Items'

const Sidebar: FC = () => {
  const navigate = useNavigate()
  const [currProduct, setCurrProduct] = useRecoilState(currProductState)
  const location = useLocation()
  const setCurrConversation = useSetRecoilState(currConversationState)
  const { settings } = useSettings()

  const onProductChange = async (
    e: MouseEvent<HTMLAnchorElement, MouseEvent>,
    company: Companies,
    product: Products
  ) => {
    const unregisters = checkApiKey(settings as Settings)
    if (unregisters.includes(company)) {
      e.preventDefault()
      navigate('/settings')
      toast.error(
        `You haven't registered an API key for ${company} yet. Filling them in settings`
      )
      return
    }

    window.localStorage.setItem('currProductState', product)
    setCurrProduct(product)

    const conversations = await db[product]
      .orderBy('updated_at')
      .reverse()
      .toArray()
    setCurrConversation(conversations[0])
  }

  return (
    <section className="no-scrollbar flex h-screen w-22 min-w-22 flex-col items-center justify-between overflow-y-scroll p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={LogoImg} />
        <section className="mt-12 w-full">
          {items.map((item) => (
            <div key={item.company} className="mb-6 flex flex-col items-center">
              {item.companyLogo}

              <div className="mt-6">
                {item.products.map((product) => (
                  <Tooltip
                    title={product.tooltip}
                    placement="right"
                    key={product.product}
                  >
                    <Link
                      to="/"
                      className="mb-6 block cursor-pointer"
                      onClick={(e) =>
                        onProductChange(e, item.company, product.product)
                      }
                    >
                      {currProduct === product.product &&
                      location.pathname === '/'
                        ? product.active
                        : product.inactive}
                    </Link>
                  </Tooltip>
                ))}
              </div>
              <Divider className="my-2 bg-opacity-20" />
            </div>
          ))}

          <div className="mb-6 flex justify-center">
            <Tooltip title="Settings" placement="right">
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
