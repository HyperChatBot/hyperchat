import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { db } from 'src/models/db'
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  edits,
  imageSizes,
  textCompletions
} from 'src/openai/models'
import { generateFileSrc } from 'src/shared/utils'
import { settingsState } from 'src/stores/settings'
import { ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'
import { v4 } from 'uuid'

const useSettings = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useRecoilState(settingsState)

  const updateSettings = async (newSettings: Settings) => {
    if (!settings) return

    await db.settings
      .where({ settings_id: settings.settings_id })
      .modify(newSettings)

    setSettings(newSettings)
  }

  const getSettings = async () => {
    setLoading(true)
    try {
      const currSettings = await db.settings.toCollection().first()

      if (!currSettings) {
        const initialSettings = {
          settings_id: v4(),
          secret_key: '',
          organization_id: '',
          author_name: '',
          theme: window.localStorage.theme || ThemeMode.system,
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
        await db.settings.add(initialSettings)
        setSettings(initialSettings)
      } else {
        if (currSettings.assistant_avatar_filename) {
          const src = await generateFileSrc(
            currSettings.assistant_avatar_filename
          )
          if (src) {
            setSettings({ ...currSettings, assistant_avatar_filename: src })
          }
        } else {
          console.log(currSettings)
          setSettings(currSettings)
        }
      }
    } catch {
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
