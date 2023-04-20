import classNames from 'classnames'
import { FC, ReactNode } from 'react'

interface Props {
  active: boolean
  children: ReactNode
  className?: string
  onClick: () => void
}

const ItemWrapper: FC<Props> = ({ active, children, className, onClick }) => {
  return (
    <div
      className={classNames(
        'mb-2 flex w-80 cursor-pointer rounded-2xl p-3 transition duration-250 ease-linear hover:bg-main-purple hover:bg-opacity-5',
        {
          'bg-main-purple bg-opacity-5': active
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default ItemWrapper
