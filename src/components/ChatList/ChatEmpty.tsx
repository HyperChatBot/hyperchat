import { FC } from 'react'
import { BoldAddIcon } from 'src/components/Icons'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import MesssageItemWrapper from './ChatItemWrapper'

interface Props {
  onClick: () => void
}

const MesssageEmpty: FC<Props> = ({ onClick }) => {
  return (
    <MesssageItemWrapper
      onClick={onClick}
      active
      className="items-center justify-center"
    >
      <p className="mr-4 font-semibold dark:text-dark-text">
        {EMPTY_CHAT_HINT}
      </p>
      <BoldAddIcon />
    </MesssageItemWrapper>
  )
}

export default MesssageEmpty
