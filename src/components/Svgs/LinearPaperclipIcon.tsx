import { FC } from 'react'
import { SvgIconProps } from 'src/types/base'

const LinearPaperclipIcon: FC<SvgIconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.97 12V15.5C11.97 17.43 13.54 19 15.47 19C17.4 19 18.97 17.43 18.97 15.5V10C18.97 6.13 15.84 3 11.97 3C8.1 3 4.97 6.13 4.97 10V16C4.97 19.31 7.66 22 10.97 22"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default LinearPaperclipIcon
