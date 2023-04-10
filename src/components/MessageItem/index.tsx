import { FC } from 'react'
import classNames from 'classnames'
import Avatar from 'src/assets/avatar_mock.png'

interface Props {
  active: boolean
}

const MesssageItem: FC<Props> = ({ active }) => {
  return (
    <div
      className={classNames('flex w-80 p-3 mb-2 rounded-2xl', {
        'bg-main-purple bg-opacity-5': active
      })}
    >
      <img src={Avatar} alt="avatar" className="w-12 h-12 rounded-xl mr-4" />
      <div className="w-full flex flex-col">
        <p className="flex justify-between">
          <span className="text-sm font-semibold">Elmer Laverty</span>
          <span className="text-xs font-semibold text-black text-opacity-30">
            12m
          </span>
        </p>

        <p className="text-xs font-semibold">Haha oh man 🔥</p>
      </div>
    </div>
  )
}

export default MesssageItem
