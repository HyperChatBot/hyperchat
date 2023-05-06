import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { db } from 'src/models/db'
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  edits,
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
  const { saveFileToAppDataDir, transformFilenameToSrc } = useAppData()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useRecoilState(settingsState)
  const setInitialDialogVisible = useSetRecoilState(initialDialogVisibleState)

  const initialSettings = async (secret_key: string) => {
    const defaultData = {
      settings_id: v4(),
      secret_key,
      organization_id: '',
      author_name: '',
      theme_mode: ThemeMode.system,
      assistant_avatar_filename: '',
      chat_model: chatCompletions[0],
      text_completion_model: textCompletions[0],
      chat_stream: true,
      text_completion_stream: false,
      edit_model: edits[0],
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
  }

  const getSettings = async () => {
    if (settings) return

    setLoading(true)
    try {
      const currSettings = await db.settings.toCollection().first()

      if (!currSettings || !currSettings.secret_key) {
        setInitialDialogVisible(true)
        return
      }

      if (currSettings.assistant_avatar_filename) {
        const src = await transformFilenameToSrc(
          currSettings.assistant_avatar_filename
        )
        if (src) {
          setSettings({ ...currSettings, assistant_avatar_filename: src })
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
