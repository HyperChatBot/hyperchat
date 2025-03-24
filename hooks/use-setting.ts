import { Setting } from '@/lib/db/schema'
import { fetcher } from '@/lib/utils'
import useSWR from 'swr'

export function useSetting() {
  const { data, error, isLoading, mutate } = useSWR<Setting>(
    `/api/setting`,
    fetcher
  )

  const updateSetting = async (payload: Setting) => {
    await fetch('/api/setting', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    mutate()
  }

  return {
    data,
    isLoading,
    error,
    mutate,
    updateSetting
  }
}
