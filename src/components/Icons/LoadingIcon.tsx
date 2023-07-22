import classNames from 'classnames'
import { FC } from 'react'
import { SvgIconProps } from 'src/types/global'

const LoadingIcon: FC<SvgIconProps> = ({ className, onClick }) => (
  <svg
    onClick={onClick}
    className={classNames('cursor-pointer', className)}
    width="24"
    height="24"
    viewBox="0 0 26.349 26.35"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <g>
        <circle cx="13.792" cy="3.082" r="3.082" />
        <circle cx="13.792" cy="24.501" r="1.849" />
        <circle cx="6.219" cy="6.218" r="2.774" />
        <circle cx="21.365" cy="21.363" r="1.541" />
        <circle cx="3.082" cy="13.792" r="2.465" />
        <circle cx="24.501" cy="13.791" r="1.232" />
        <path
          d="M4.694,19.84c-0.843,0.843-0.843,2.207,0,3.05c0.842,0.843,2.208,0.843,3.05,0c0.843-0.843,0.843-2.207,0-3.05
			C6.902,18.996,5.537,18.988,4.694,19.84z"
        />
        <circle cx="21.364" cy="6.218" r="0.924" />
      </g>
    </g>
  </svg>
)

export default LoadingIcon
