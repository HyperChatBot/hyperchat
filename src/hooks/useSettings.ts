import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useDB } from 'src/hooks'
import { settingsState } from 'src/stores/global'
import { Settings } from 'src/types/settings'

const useSettings = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useRecoilState(settingsState)
  const { updateOneById, toArray } = useDB('settings')

  const updateSettings = async (newSettings: Settings) => {
    if (!settings) return

    await updateOneById(settings.id, newSettings)

    if (
      !settings.assistantAvatarFilename.endsWith(
        newSettings.assistantAvatarFilename
      )
    ) {
      const src = await window.electronAPI.transformFilenameToSrc({
        filename: newSettings.assistantAvatarFilename
      })
      if (src) {
        const blob = new Blob([src.arrayBuffer], {
          type: 'application/octet-stream'
        })
        const assetUrl = URL.createObjectURL(blob)
        setSettings({ ...newSettings, assistantAvatarFilename: assetUrl })
      }
    } else {
      setSettings(newSettings)
    }

    enqueueSnackbar('Settings updated successfully.', { variant: 'success' })
  }

  const getSettings = async () => {
    setLoading(true)
    try {
      const settings = (await toArray()) as Settings[]
      const currSettings = settings?.[0]

      if (currSettings.assistantAvatarFilename) {
        try {
          const src = await window.electronAPI.transformFilenameToSrc({
            filename: currSettings.assistantAvatarFilename
          })

          if (src) {
            const blob = new Blob([src.arrayBuffer], {
              type: 'application/octet-stream'
            })
            const assetUrl = URL.createObjectURL(blob)
            setSettings({
              ...currSettings,
              assistantAvatarFilename: assetUrl
            })
          }
        } catch {
          // if transform is error
          setSettings(currSettings)
        }
      } else {
        setSettings(currSettings)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!settings) {
      getSettings()
    }
  }, [settings])

  return { settings, loading, updateSettings }
}

export default useSettings
