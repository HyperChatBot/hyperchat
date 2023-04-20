import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const LinearSendIcon: FC<SvgIconProps> = ({
  className,
  pathClassName,
  onClick
}) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={pathClassName}
      d="M10.11 13.65L13.69 10.06M7.39999 6.32L15.89 3.49C19.7 2.22 21.77 4.3 20.51 8.11L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23 7.39999 6.32V6.32Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearSendIcon
