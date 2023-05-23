import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const AnthropicLogoIcon: FC<SvgIconProps> = ({
  className,
  pathClassName,
  onClick
}) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width="34.5"
    height="24"
    viewBox="0 0 46 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <svg
      width="46"
      height="32"
      viewBox="0 0 46 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-black dark:fill-white"
        d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z"
      ></path>
    </svg>
  </svg>
)

export default AnthropicLogoIcon
