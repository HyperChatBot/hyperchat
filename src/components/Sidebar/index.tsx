import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  CpuChipIcon as CpuChipIconOutline,
  MicrophoneIcon as MicrophoneIconOutline,
  PhotoIcon as PhotoIconOutline,
  ScaleIcon as ScaleIconOutline
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CpuChipIcon as CpuChipIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
  PhotoIcon as PhotoIconSolid,
  ScaleIcon as ScaleIconSolid
} from '@heroicons/react/24/solid'
import { Tooltip } from 'flowbite-react'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import Avatar from '../Avatar'

const iconClassName = 'h-6 w-6 text-black dark:text-white'

const items = [
  {
    tooltip: 'Chat Completion',
    pathname: '/',
    inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
    active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Text Completion',
    pathname: '/completion',
    inactive: (
      <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
    ),
    active: <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Audio',
    pathname: '/audio',
    inactive: <MicrophoneIconOutline className={iconClassName} />,
    active: <MicrophoneIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Embeddings',
    pathname: '/embeddings',
    inactive: <CpuChipIconOutline className={iconClassName} />,
    active: <CpuChipIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Moderation',
    pathname: '/moderation',
    inactive: <ScaleIconOutline className={iconClassName} />,
    active: <ScaleIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Images',
    pathname: '/images',
    inactive: <PhotoIconOutline className={iconClassName} />,
    active: <PhotoIconSolid className={iconClassName} />
  },
  {
    tooltip: 'Settings',
    pathname: '/settings',
    inactive: <Cog6ToothIconOutline className={iconClassName} />,
    active: <Cog6ToothIconSolid className={iconClassName} />
  }
]

const Siderbar: FC = () => {
  const location = useLocation()

  return (
    <section className="flex h-screen w-22 min-w-22 flex-col items-center justify-between p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={ChatGPTLogoImg} />
        <section className="mt-12">
          {items.map((item, key) => (
            <div key={key} className="mb-8">
              <Tooltip content={item.tooltip} placement="right">
                <Link to={item.pathname}>
                  {location.pathname === item.pathname
                    ? item.active
                    : item.inactive}
                </Link>
              </Tooltip>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}

export default Siderbar
