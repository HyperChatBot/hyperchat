import { FC } from 'react'
import { OutlinePlusIcon } from 'src/components/Icons'
import { EMPTY_CHAT_HINT } from 'src/shared/constants'
import MesssageItemWrapper from './ItemWrapper'

interface Props {
  onClick: () => void
}

const EmptyItem: FC<Props> = ({ onClick }) => {
  return (
    <MesssageItemWrapper
      onClick={onClick}
      active
      className="items-center justify-center"
    >
      <p className="mr-4 font-semibold dark:text-dark-text">
        {EMPTY_CHAT_HINT}
      </p>
      <OutlinePlusIcon />
    </MesssageItemWrapper>
  )
}

export default EmptyItem
