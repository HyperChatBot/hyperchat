import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const OutlinePlusIcon: FC<SvgIconProps> = ({
  className,
  pathClassName,
  onClick
}) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={pathClassName}
      d="M20 3.33334C10.8167 3.33334 3.33334 10.8167 3.33334 20C3.33334 29.1833 10.8167 36.6667 20 36.6667C29.1833 36.6667 36.6667 29.1833 36.6667 20C36.6667 10.8167 29.1833 3.33334 20 3.33334ZM26.6667 21.25H21.25V26.6667C21.25 27.35 20.6833 27.9167 20 27.9167C19.3167 27.9167 18.75 27.35 18.75 26.6667V21.25H13.3333C12.65 21.25 12.0833 20.6833 12.0833 20C12.0833 19.3167 12.65 18.75 13.3333 18.75H18.75V13.3333C18.75 12.65 19.3167 12.0833 20 12.0833C20.6833 12.0833 21.25 12.65 21.25 13.3333V18.75H26.6667C27.35 18.75 27.9167 19.3167 27.9167 20C27.9167 20.6833 27.35 21.25 26.6667 21.25Z"
      fill="#615EF0"
    />
  </svg>
)

export default OutlinePlusIcon
