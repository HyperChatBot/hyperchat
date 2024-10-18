import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const SolidCloseIcon: FC<SvgIconProps> = ({
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
      fill="currentColor"
      d="M11.996 20.5a8.2 8.2 0 0 1-3.282-.666A8.6 8.6 0 0 1 6 17.999a8.8 8.8 0 0 1-1.834-2.716A8.2 8.2 0 0 1 3.5 12q0-1.744.666-3.283a8.711 8.711 0 0 1 4.54-4.55 8.2 8.2 0 0 1 3.282-.667q1.752 0 3.29.667A8.7 8.7 0 0 1 17.99 6.01a8.6 8.6 0 0 1 1.843 2.707A8.2 8.2 0 0 1 20.5 12a8.2 8.2 0 0 1-.666 3.283 8.7 8.7 0 0 1-4.556 4.55 8.2 8.2 0 0 1-3.282.667m-2.698-5.02a.81.81 0 0 0 .576-.222l2.13-2.147 2.139 2.147a.76.76 0 0 0 .559.223q.33 0 .55-.223a.75.75 0 0 0 .231-.55.72.72 0 0 0-.23-.552l-2.147-2.148 2.155-2.147a.77.77 0 0 0 .23-.552.73.73 0 0 0-.23-.543.73.73 0 0 0-.543-.23.75.75 0 0 0-.55.23l-2.164 2.148L9.85 8.766a.78.78 0 0 0-.55-.214.77.77 0 0 0-.552.222.73.73 0 0 0-.222.552q0 .305.23.543l2.147 2.14-2.147 2.155a.73.73 0 0 0-.23.543q0 .321.222.551a.77.77 0 0 0 .551.223"
    />
  </svg>
)

export default SolidCloseIcon
