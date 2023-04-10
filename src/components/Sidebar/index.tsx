import { FC } from 'react'
import { LinearHomeIcon } from 'src/components/Svgs'

const Siderbar: FC = () => {
  return (
    <section className="w-22 h-full shadow-sidebar flex-1 flex flex-col items-center p-4">
      <div className="rounded-14 w-14 h-14 bg-main-purple flex items-center justify-center text-white font-medium">
        Q
      </div>
      <section>
        <LinearHomeIcon />
      </section>
    </section>
  )
}

export default Siderbar
