import { useEffect } from 'react'
import {useSetRecoilState} from 'recoil'
import {onlineState} from 'src/stores/global'

const useOnline = () => {
  const setOnline = useSetRecoilState(onlineState)

  useEffect(() => {
    function handleOnlineStatus() {
      setOnline(true)
    }

    function handleOfflineStatus() {
      setOnline(false)
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOfflineStatus)
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOfflineStatus)
    }
  }, [])
}

export default useOnline
