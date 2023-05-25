import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { db } from 'src/models/db'
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  imageSizes,
  textCompletions
} from 'src/shared/constants'
import { initialDialogVisibleState } from 'src/stores/global'
import { settingsState } from 'src/stores/settings'
import { ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'
import { v4 } from 'uuid'
import useAppData from './useAppData'

const useSettings = () => {
  const { transformFilenameToSrc } = useAppData()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useRecoilState(settingsState)
  const setInitialDialogVisible = useSetRecoilState(initialDialogVisibleState)

  const initialSettings = async (openai_secret_key: string) => {
    const defaultData = {
      settings_id: v4(),
      openai_secret_key,
      openai_organization_id: '',
      openai_author_name: '',
      azure_secret_key: '',
      azure_endpoint: '',
      theme_mode: ThemeMode.system,
      assistant_avatar_filename: '',
      chat_model: chatCompletions[0],
      text_completion_model: textCompletions[0],
      chat_stream: true,
      text_completion_stream: false,
      audio_transcription_model: audios[0],
      audio_translation_model: audios[0],
      audio_response_type: audioResponseTypes[0],
      image_generation_size: imageSizes[0]
    }

    await db.settings.add(defaultData)
    setSettings(defaultData)
  }

  const updateSettings = async (newSettings: Settings) => {
    if (!settings) return

    await db.settings
      .where({ settings_id: settings.settings_id })
      .modify(newSettings)

    if (
      !settings.assistant_avatar_filename.endsWith(
        newSettings.assistant_avatar_filename
      )
    ) {
      const src = await transformFilenameToSrc(
        newSettings.assistant_avatar_filename
      )
      if (src) {
        setSettings({ ...newSettings, assistant_avatar_filename: src })
      }
    } else {
      setSettings(newSettings)
    }

    toast.success('Settings updated successfully.')
  }

  const getSettings = async () => {
    if (settings) return

    setLoading(true)
    try {
      const currSettings = await db.settings.toCollection().first()

      if (!currSettings) {
        return
      }

      if (
        !currSettings.openai_secret_key &&
        !(currSettings.azure_endpoint && currSettings.azure_secret_key)
      ) {
        setInitialDialogVisible(true)
      }

      if (currSettings.assistant_avatar_filename) {
        const src = await transformFilenameToSrc(
          currSettings.assistant_avatar_filename
        )

        if (src) {
          setSettings({ ...currSettings, assistant_avatar_filename: src })
        } else {
          // if transform is error
          setSettings(currSettings)
        }
      } else {
        setSettings(currSettings)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSettings()
  }, [settings])

  return { settings, loading, initialSettings, updateSettings }
}

export default useSettings
