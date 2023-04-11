import { FC } from 'react'
import classNames from 'classnames'

interface Props {
  direction?: 'horizontal' | 'vertical'
  className?: string
}

const Divider: FC<Props> = ({ direction = 'horizontal', className }) => (
  <div
    className={classNames(
      ' bg-black bg-opacity-5',
      {
        'w-full h-px': direction === 'horizontal',
        'w-px h-screen': direction === 'vertical'
      },
      className
    )}
  />
)

export default Divider
