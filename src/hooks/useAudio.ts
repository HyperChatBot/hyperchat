import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { HashFile } from 'src/types/global'

const useAudio = (prompt: string, hashFile: HashFile | null) => {
  const currConversation = useRecoilValue(currConversationState)
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const openai = useOpenAI()
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

  const createTranscription = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, language, responseFormat } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      saveUserMessage(prompt)
      setLoading(true)

      const transcription = await openai.createTranscription(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature,
        language === '' ? undefined : language
      )

      saveCommonAssistantMessage(
        // If `responseFormat` is `json` or `verbose_json`, the result is `transcription.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `transcription.data`.
        transcription.data.text || (transcription.data as unknown as string)
      )
    } catch (error) {
      showErrorToast(error)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, responseFormat } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      await saveUserMessage(prompt)
      setLoading(true)

      const translation = await openai.createTranslation(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature
      )

      saveCommonAssistantMessage(
        // If `responseFormat` is `json` or `verbose_json`, the result is `translation.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `translation.data`.
        translation.data.text || (translation.data as unknown as string)
      )
    } catch (error) {
      showErrorToast(error)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTranslation, createTranscription }
}

export default useAudio
