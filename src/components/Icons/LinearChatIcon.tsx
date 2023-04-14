import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/base'

const LinearChatIcon: FC<SvgIconProps> = ({
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
      className={classNames(
        'dark:stroke-current dark:text-dark-bubule-assistant-text',
        pathClassName
      )}
      d="M7 10.74V13.94M12 9V15.68M17 10.74V13.94M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearChatIcon
