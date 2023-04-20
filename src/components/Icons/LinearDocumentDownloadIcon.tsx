import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const LinearDocumentDownloadIcon: FC<SvgIconProps> = ({
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
      d="M9 11V17L11 15M9 17L7 15"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearDocumentDownloadIcon
