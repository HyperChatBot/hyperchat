import classNames from 'classnames'
import { FC } from 'react'

interface Props {
  src: string
  size?: 'xs' | 'm'
  className?: string
}

const Avatar: FC<Props> = ({ src, size, className }) => (
  <img
    src={src}
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
