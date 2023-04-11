import { FC } from 'react'
import classNames from 'classnames'
import Img from 'src/assets/avatar_mock.png'

interface Props {
  size?: 'xs' | 'm'
  className?: string
}

const Avatar: FC<Props> = ({ size, className }) => (
  <img
    src={Img}
    alt="avatar"
    className={classNames(
      'w-12 h-12 rounded-xl',
      {
        'w-10 h-10': size === 'xs'
      },
      className
    )}
  />
)

export default Avatar
