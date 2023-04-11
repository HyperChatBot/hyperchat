import classNames from 'classnames'
import { FC } from 'react'
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
      'h-12 w-12 rounded-xl',
      {
        'h-10 w-10': size === 'xs'
      },
      className
    )}
  />
)

export default Avatar
