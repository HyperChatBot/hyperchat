import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const LinearCheckIcon: FC<SvgIconProps> = ({ className, onClick }) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039" />
  </svg>
)

export default LinearCheckIcon
