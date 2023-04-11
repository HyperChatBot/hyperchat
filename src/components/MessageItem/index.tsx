import classNames from 'classnames'
import { FC } from 'react'
import Avatar from 'src/assets/avatar_mock.png'

interface Props {
  active: boolean
}

const MesssageItem: FC<Props> = ({ active }) => {
  return (
    <div
      className={classNames('mb-2 flex w-80 rounded-2xl p-3', {
        'bg-main-purple bg-opacity-5': active
      })}
    >
      <img src={Avatar} alt="avatar" className="mr-4 h-12 w-12 rounded-xl" />
      <div className="flex w-full flex-col">
        <p className="flex justify-between">
          <span className="text-sm font-semibold">Elmer Laverty</span>
          <span className="text-xs font-semibold text-black text-opacity-30">
            12m
          </span>
        </p>

        <p className="text-xs font-semibold text-black text-opacity-40">
          Haha oh man 🔥
        </p>
      </div>
    </div>
  )
}

export default MesssageItem
