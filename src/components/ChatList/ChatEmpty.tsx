import { FC } from 'react'
import { BoldAddIcon } from 'src/components/Icons'
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
        Create your first conversation!
      </p>
      <BoldAddIcon />
    </MesssageItemWrapper>
  )
}

export default MesssageEmpty
