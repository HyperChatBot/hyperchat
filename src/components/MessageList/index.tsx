import { FC } from 'react'
import Divider from '../Divider'
import { BoldAddIcon, LinearArrowDownIcon } from '../Icons'
import MesssageItem from '../MessageItem'

const MesssageList: FC = () => {
  return (
    <section className="">
      <section className="flex items-center justify-between p-6">
        <section className="flex items-center">
          <span className="text-xl font-semibold dark:text-dark-text">
            Messsage
          </span>
          <LinearArrowDownIcon className="ml-1.5 mr-2.5" />
          <span className="dark:text-dark-sub-text rounded-3xl bg-default-badge pb-0.5 pl-2 pr-2 pt-0.5 text-xs font-semibold">
            12
          </span>
        </section>
        <BoldAddIcon />
      </section>

      <Divider />

      <input
        type="text"
        className="mb-3 ml-6 mr-6 mt-3 w-75 rounded-xl bg-search-input pb-3 pl-2.5 pr-2.5 pt-3 text-sm text-black text-opacity-40  dark:bg-dark-search-input"
      />

      <section className="no-scrollbar ml-4 mr-4 h-[calc(100vh_-_10rem)] overflow-y-scroll">
        {new Array(25).fill(0).map((_, k) => (
          <MesssageItem key={k} active={k === 1} />
        ))}
      </section>
    </section>
  )
}

export default MesssageList
