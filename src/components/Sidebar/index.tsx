import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import Tooltip from '@mui/material/Tooltip'
import { FC } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import HyperChatLogo from 'src/assets/images/logo.png'
import { useConfiguration, useSettings } from 'src/hooks'
import companies from 'src/shared/companies'
import { companyState } from 'src/stores/global'
import Avatar from '../Avatar'
import Divider from '../Divider'
import Loading from '../Loading'

const Sidebar: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [company, setCompany] = useRecoilState(companyState)
  const { settings } = useSettings()
  const { configuration } = useConfiguration()

  if (!settings || !configuration) return <Loading />

  return (
    <section className="no-scrollbar flex h-screen w-22 min-w-22 flex-col items-center justify-between overflow-y-scroll p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={HyperChatLogo} />
        <section className="mt-12 w-full">
          <div className="mb-6 flex flex-col items-center gap-6">
            {companies.map(({ name, logo: Logo }) => {
              const isCurrentCompany = name === company
              return (
                <div
                  key={name}
                  onClick={() => {
                    window.localStorage.setItem('$$hyperchat-company', name)
                    setCompany(name)
                    navigate('/', { replace: true })
                  }}
                >
                  <Logo
                    className={`${!isCurrentCompany && 'grayscale'} h-6 w-6`}
                  />
                </div>
              )
            })}
          </div>
          <Divider />
          <div className="my-6 flex justify-center">
            <Tooltip title="Settings" placement="right">
              <Link to="/settings">
                {location.pathname === '/settings' ? (
                  <Cog6ToothIconSolid
                    className={'h-6 w-6 text-black dark:text-white'}
                  />
                ) : (
                  <Cog6ToothIconOutline
                    className={'h-6 w-6 text-black dark:text-white'}
                  />
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
