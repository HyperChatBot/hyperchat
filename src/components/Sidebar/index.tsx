import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  LanguageIcon as LanguageIconOutline,
  MicrophoneIcon as MicrophoneIconOutline,
  PhotoIcon as PhotoIconOutline
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  LanguageIcon as LanguageIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
  PhotoIcon as PhotoIconSolid
} from '@heroicons/react/24/solid'
import { Tooltip } from 'flowbite-react'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import { conversationTitles } from 'src/shared/constants'
import { currProductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import Avatar from '../Avatar'

const iconClassName = 'h-6 w-6 text-black dark:text-white'

const items = [
  {
    product: Products.ChatCompletion,
    tooltip: conversationTitles[Products.ChatCompletion],
    inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
    active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
  },
  {
    product: Products.TextCompletion,
    tooltip: conversationTitles[Products.TextCompletion],
    inactive: (
      <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
    ),
    active: <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
  },
  {
    product: Products.AudioTranscription,
    tooltip: conversationTitles[Products.AudioTranscription],
    inactive: <MicrophoneIconOutline className={iconClassName} />,
    active: <MicrophoneIconSolid className={iconClassName} />
  },
  {
    product: Products.AudioTranslation,
    tooltip: conversationTitles[Products.AudioTranslation],
    inactive: <LanguageIconOutline className={iconClassName} />,
    active: <LanguageIconSolid className={iconClassName} />
  },
  {
    product: Products.Image,
    tooltip: conversationTitles[Products.Image],
    inactive: <PhotoIconOutline className={iconClassName} />,
    active: <PhotoIconSolid className={iconClassName} />
  }
]

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
        <Avatar size="xs" src={ChatGPTLogoImg} />
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
