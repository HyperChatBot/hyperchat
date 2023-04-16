import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/base'

const LinearArrowdownIcon: FC<SvgIconProps> = ({
  width,
  height,
  className,
  pathClassName,
  onClick
}) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width={width || 16}
    height={height || 16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={classNames(
        'dark:stroke-current dark:text-dark-bubule-assistant-text',
        pathClassName
      )}
      d="M13.28 5.96667L8.93333 10.3133C8.42 10.8267 7.58 10.8267 7.06667 10.3133L2.72 5.96667"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearArrowdownIcon
