import { FC } from 'react'
import {
  BoldMessageIcon,
  LinearCalendarIcon,
  LinearChatIcon,
  LinearHomeIcon,
  LinearSearchNormalIcon,
  LinearSettingIcon
} from 'src/components/Icons'

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
    <section className="flex h-screen w-22 flex-col items-center justify-between p-4 shadow-sidebar">
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-14 bg-main-purple font-medium text-white">
          Q
        </div>
        <section className="mt-12 cursor-pointer">
          {items.map((item, key) => (
            <div key={key} className="mb-8">
              {item.icon}
            </div>
          ))}
        </section>
      </div>
      <LinearSettingIcon />
    </section>
  )
}

export default Siderbar
