import { FC } from 'react'
import Avatar from '../Avatar'
import { BoldCallIcon } from '../Icons'

const ContractHeader: FC = () => (
  <section className="flex w-160 items-start justify-between pb-5 pl-6 pr-6 pt-5">
    <section className="flex items-center">
      <Avatar size="xs" />
      <section className="ml-4 flex flex-col">
        <p className="text-xl font-semibold text-black dark:text-dark-text">Florencio Dorrance</p>
        <p className="flex items-center">
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-status-green" />
          <span className="text-xs font-semibold text-black  text-opacity-60 dark:text-dark-text-sub">
            Online
          </span>
        </p>
      </section>
    </section>
    <section className="flex rounded-lg bg-main-purple bg-opacity-10 pb-2.5 pl-4 pr-4 pt-2.5 text-main-purple">
      <BoldCallIcon className="mr-2" />
      <span>Call</span>
    </section>
  </section>
)

export default ContractHeader
