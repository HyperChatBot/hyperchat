import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import Tooltip from '@mui/material/Tooltip'
import { capitalCase } from 'change-case'
import { enqueueSnackbar } from 'notistack'
import { FC, MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import LogoImg from 'src/assets/chatbot.png'
import { AzureLogoIcon, OpenAILogoIcon } from 'src/components/Icons'
import { useSettings } from 'src/hooks'
import { BAN_ACTIVE_HINT } from 'src/shared/constants'
import { loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { Companies, Products } from 'src/types/global'
import Avatar from '../Avatar'
import Divider from '../Divider'
import items, { iconClassName } from './Items'

const companyLogo = {
  [Companies.Azure]: {
    logo: <AzureLogoIcon />
  },
  [Companies.OpenAI]: {
    logo: <OpenAILogoIcon />
  }
}

const Sidebar: FC = () => {
  const loading = useRecoilValue(loadingState)
  const location = useLocation()
  const { settings } = useSettings()
  const [currProduct, setCurrProduct] = useRecoilState(currProductState)

  const onProductChange = async (e: MouseEvent, product: Products) => {
    if (loading) {
      enqueueSnackbar(BAN_ACTIVE_HINT, { variant: 'warning' })
      return
    }
    window.localStorage.setItem('currProductState', product)
    setCurrProduct(product)
  }

  if (!settings) return null

  return (
    <section className="no-scrollbar flex h-screen w-22 min-w-22 flex-col items-center justify-between overflow-y-scroll p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={LogoImg} />
        <section className="mt-12 w-full">
          {
            <div className="mb-6 flex flex-col items-center">
              {companyLogo[settings.company].logo}

              <div className="mt-6">
                {items
                  .filter((item) => item.realm.includes(settings.company))
                  .map((item) => (
                    <Tooltip
                      title={capitalCase(item.product)}
                      placement="right"
                      key={item.product}
                    >
                      <Link
                        to="/"
                        className="mb-6 block cursor-pointer"
                        onClick={(e) => onProductChange(e, item.product)}
                      >
                        {currProduct === item.product &&
                        location.pathname === '/'
                          ? item.active
                          : item.inactive}
                      </Link>
                    </Tooltip>
                  ))}
              </div>
              <Divider className="my-2 bg-opacity-20" />
            </div>
          }

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
