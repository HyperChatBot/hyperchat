import { AudioResponseFormat } from 'openai/resources'
import { Uploadable } from 'openai/src/uploads'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useMessages, useOpenAI } from 'src/hooks'
import { showApiRequestErrorToast } from 'src/shared/utils'
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
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      // TODO: Uses pure fetch.
      const transcription = await openai.audio.transcriptions.create({
        file: hashFile.file as Uploadable,
        model,
        prompt,
        response_format: responseFormat as AudioResponseFormat,
        temperature,
        language: language === '' ? undefined : language
      })

      saveCommonAssistantMessage(transcription.text)
    } catch (error) {
      showApiRequestErrorToast()
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
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      // TODO: Uses pure fetch.
      const translation = await openai.audio.translations.create({
        file: hashFile.file,
        model,
        prompt,
        response_format: responseFormat as AudioResponseFormat,
        temperature
      })

      saveCommonAssistantMessage(
        translation.text
      )
    } catch (error) {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTranslation, createTranscription }
}

export default useAudio
