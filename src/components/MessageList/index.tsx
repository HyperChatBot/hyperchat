import { FC } from 'react'
import { LinearArrowDownIcon, BoldAddIcon } from '../Icons'
import MesssageItem from '../MessageItem'

const MesssageList: FC = () => {
  return (
    <section className="">
      <section className="flex items-center justify-between p-6">
        <section className="flex items-center">
          <span className="font-semibold text-xl">Messsage</span>
          <LinearArrowDownIcon className="ml-1.5 mr-2.5" />
          <span className="bg-badge pt-0.5 pr-2 pb-0.5 pl-2 font-semibold text-xs rounded-3xl">
            12
          </span>
        </section>
        <BoldAddIcon />
      </section>

      <div className="w-full h-px bg-black bg-opacity-5" />

      <input
        type="text"
        className="mt-3 mr-6 mb-3 ml-6 pt-1.5 pr-2.5 pb-1.5 pl-2.5 bg-search-input rounded-xl w-75 text-sm text-black text-opacity-40  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      />

      <section className="ml-4 mr-4 h-[calc(100vh_-_10rem)] overflow-y-scroll no-scrollbar">
        {new Array(25).fill(0).map((_, k) => (
          <MesssageItem key={k} active={k === 1} />
        ))}
      </section>
    </section>
  )
}

export default MesssageList
