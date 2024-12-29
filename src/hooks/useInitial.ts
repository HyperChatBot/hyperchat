import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  companyState,
  configurationState,
  customBotAvatarUrlState,
  settingsState
} from 'src/stores/global'
import { Configuration } from 'src/types/conversation'
import { Settings } from 'src/types/settings'
import useDB from './useDB'

const useInitial = () => {
  const company = useRecoilValue(companyState)
  const setConfiguration = useSetRecoilState(configurationState)
  const setSettings = useSetRecoilState(settingsState)
  const setCustomBotAvatarUrl = useSetRecoilState(customBotAvatarUrlState)
  const { toArray: configurationsToArray } = useDB('configurations')
  const { toArray: settingsToArray } = useDB('settings')

  const getConfiguration = async () => {
    const configurations = await configurationsToArray<Configuration>()
    const configurationByCompany = configurations?.find(
      (configuration) => configuration.company === company
    )

    if (configurationByCompany) {
      setConfiguration(configurationByCompany)
    }
  }

  const getSettings = async () => {
    const [settings] = await settingsToArray<Settings>()
    console.log(settings)

    if (settings.assistantAvatarFilename) {
      try {
        const src = await window.electronAPI.transformFilenameToSrc({
          filename: settings.assistantAvatarFilename
        })

        if (src) {
          const blob = new Blob([src.arrayBuffer], {
            type: 'application/octet-stream'
          })
          const assetUrl = URL.createObjectURL(blob)
          setCustomBotAvatarUrl(assetUrl)
        }
      } finally {
        setSettings(settings)
      }
    } else {
      setSettings(settings)
    }
  }

  useEffect(() => {
    getConfiguration()
  }, [company])

  useEffect(() => {
    getSettings()
  }, [])
}

export default useInitial
