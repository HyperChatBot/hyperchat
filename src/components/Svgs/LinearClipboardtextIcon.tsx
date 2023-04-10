import { FC } from 'react'
import { SvgIconProps } from 'src/types/base'

const LinearClipboardTextIcon: FC<SvgIconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12.2H15M8 16.2H12.38M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4.01999C19.33 4.19999 21 5.42999 21 9.99999V16C21 20 20 22 15 22H9C4 22 3 20 3 16V9.99999C3 5.43999 4.67 4.19999 8 4.01999"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearClipboardTextIcon
