import { enqueueSnackbar } from 'notistack'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useDB } from 'src/hooks'
import { customBotAvatarUrlState, settingsState } from 'src/stores/global'
import { Settings } from 'src/types/settings'

const useSettings = () => {
  const [settings, setSettings] = useRecoilState(settingsState)
  const setCustomBotAvatarUrl = useSetRecoilState(customBotAvatarUrlState)
  const { updateOneById } = useDB('settings')

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
        setCustomBotAvatarUrl(assetUrl)
      }
    } else {
      setSettings(newSettings)
    }

    enqueueSnackbar('Settings updated successfully.', { variant: 'success' })
  }

  return { settings, updateSettings }
}

export default useSettings
