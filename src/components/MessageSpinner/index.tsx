import { FC } from 'react'

const MessageSpinner: FC = () => (
  <div className="mb-2 flex animate-pulse items-center justify-center space-x-2 p-2">
    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
    <div className="h-2 w-2 rounded-full bg-green-400"></div>
    <div className="h-2 w-2 rounded-full bg-black dark:bg-white"></div>
  </div>
)

export default MessageSpinner
