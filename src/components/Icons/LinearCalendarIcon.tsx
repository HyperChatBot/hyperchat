import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const LinearCalendarIcon: FC<SvgIconProps> = ({
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
        'dark:stroke-current dark:text-dark-bubble-assistant-text',
        pathClassName
      )}
      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={classNames(
        'dark:stroke-current dark:text-dark-bubble-assistant-text',
        pathClassName
      )}
      d="M11.995 13.7H12.005M8.29401 13.7H8.30401M8.29401 16.7H8.30401"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearCalendarIcon
