import { FC } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'

const Loading: FC = () => {
  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-screen flex-col bg-blend-overlay">
      <img
        src={HyperChatLogo}
        alt=""
        className="mb-4 h-32 w-32 animate-bounce"
      />
      <h3 className="brand animate-wiggle text-6xl text-white">Hyper Chat</h3>
    </div>
  )
}

export default Loading
