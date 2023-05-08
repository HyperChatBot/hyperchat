import classNames from 'classnames'
import { FC } from 'react'

interface Props {
  src: string
  size?: 'xs' | 'm'
  className?: string
  onClick?: () => void
}

const Avatar: FC<Props> = ({ src, size, className, onClick }) => (
  <img
    src={src}
    alt="avatar"
    onClick={onClick}
    className={classNames(
      'h-12 w-12 rounded-xl object-cover',
      {
        'h-10 w-10': size === 'xs'
      },
      className
    )}
  />
)

export default Avatar
