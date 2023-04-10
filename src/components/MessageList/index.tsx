import { FC } from 'react'
import MesssageItem from '../MessageItem'

const MesssageList: FC = () => {
  return (
    <section className='ml-4'>
      {new Array(5).fill(0).map((_, k) => (
        <MesssageItem key={k} active={k === 1} />
      ))}
    </section>
  )
}

export default MesssageList
