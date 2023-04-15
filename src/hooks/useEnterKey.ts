import { useEffect } from 'react'

const useEnterKey = (callback: () => void) => {
  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.keyCode === 13 || event.key === 'Enter') {
        callback()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useEnterKey
