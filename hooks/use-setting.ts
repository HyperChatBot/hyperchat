import { Setting } from '@/lib/db/schema'
import { fetcher } from '@/lib/utils'
import useSWR from 'swr'

export function useSetting() {
  const { data, error, isLoading, mutate } = useSWR<Setting>(
    `/api/setting`,
    fetcher
  )

  const updateSetting = async (id: string, payload: Setting) => {
    await fetch('/api/setting', {
      method: 'POST',
      body: JSON.stringify({ id, setting: payload })
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
