import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import Tooltip from '@mui/material/Tooltip'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LogoImg from 'src/assets/chatbot.png'
import {
  AnthropicLogoIcon,
  GoogleLogoIcon,
  OpenAiLogoIcon
} from 'src/components/Icons'
import { useSettings } from 'src/hooks'
import { Companies } from 'src/types/global'
import Avatar from '../Avatar'

const companyLogo = {
  [Companies.OpenAI]: {
    logo: <OpenAiLogoIcon />
  },
  [Companies.Anthropic]: {
    logo: <AnthropicLogoIcon />
  },
  [Companies.Google]: {
    logo: <GoogleLogoIcon />
  }
}

const Sidebar: FC = () => {
  const location = useLocation()
  const { settings } = useSettings()

  if (!settings) return null

  return (
    <section className="no-scrollbar flex h-screen w-22 min-w-22 flex-col items-center justify-between overflow-y-scroll p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={LogoImg} />
        <section className="mt-12 w-full">
          <div className="mb-6 flex flex-col items-center">
            {companyLogo[settings.company].logo}
          </div>

          <div className="mb-6 flex justify-center">
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
