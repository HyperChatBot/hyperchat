import { FC } from 'react'
import Avatar from '../Avatar'
import { BoldCallIcon } from '../Icons'

const ContractHeader: FC = () => (
  <section className="pt-5 pr-6 pb-5 pl-6 flex items-start w-160 justify-between">
    <section className="flex items-center">
      <Avatar size="xs" />
      <section className="ml-4 flex flex-col">
        <p className="text-black font-semibold text-xl">Florencio Dorrance</p>
        <p className="flex items-center">
          <span className="w-2.5 h-2.5 bg-status-green rounded-full mr-2" />
          <span className="text-black text-opacity-60 font-semibold  text-xs">
            Online
          </span>
        </p>
      </section>
    </section>
    <section className="flex bg-main-purple bg-opacity-10 text-main-purple pt-2.5 pb-2.5 pr-4 pl-4 rounded-lg">
      <BoldCallIcon className="mr-2" />
      <span>Call</span>
    </section>
  </section>
)

export default ContractHeader
