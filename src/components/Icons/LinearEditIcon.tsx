import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/base'

const LinearEditIcon: FC<SvgIconProps> = ({
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
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
  >
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      className={classNames(
        'dark:stroke-current dark:text-dark-bubule-assistant-text',
        pathClassName
      )}
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      className={classNames(
        'dark:stroke-current dark:text-dark-bubule-assistant-text',
        pathClassName
      )}
    />
  </svg>
)

export default LinearEditIcon
