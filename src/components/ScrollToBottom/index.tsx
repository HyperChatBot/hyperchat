import classNames from 'classnames'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { LinearArrowDownIcon } from 'src/components/Icons'
import { scrollToBottomBtnVisibleState } from 'src/stores/chat'

interface Props {
  onClick: () => void
}

const ScrollToBottom: FC<Props> = ({ onClick }) => {
  const scrollToBottomBtnVisible = useRecoilValue(scrollToBottomBtnVisibleState)

  return (
    <section 
      className={classNames(
        'absolute bottom-32 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-main-purple opacity-0 duration-250',
        { 'opacity-100 duration-250': scrollToBottomBtnVisible }
      )}
      onClick={onClick}
    >
      <LinearArrowDownIcon
        width={20}
        height={20}
        pathClassName="text-white stroke-current"
      />
    </section>
  )
}

export default ScrollToBottom
