import { FC } from 'react'
import ChatGPTLogoImg from 'src/assets/chatgpt-avatar.png'
import Avatar from '../Avatar'
import {
  BoldMessageIcon,
  LinearCalendarIcon,
  LinearChatIcon,
  LinearHomeIcon,
  LinearSearchNormalIcon
} from '../Icons'
import Settings from '../Settings'

const items = [
  {
    icon: <LinearHomeIcon />
  },
  {
    icon: <BoldMessageIcon />
  },
  {
    icon: <LinearChatIcon />
  },
  {
    icon: <LinearSearchNormalIcon />
  },
  {
    icon: <LinearCalendarIcon />
  }
]

const Siderbar: FC = () => {
  return (
    <section className="flex h-screen w-22 flex-col items-center justify-between p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={ChatGPTLogoImg} />
        <section className="mt-12">
          {items.map((item, key) => (
            <div key={key} className="mb-8">
              {item.icon}
            </div>
          ))}
        </section>
      </div>
      <Settings />
    </section>
  )
}

export default Siderbar
