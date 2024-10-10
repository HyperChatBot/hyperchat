import { AudioResponseFormat } from 'openai/resources'
import { Uploadable } from 'openai/src/uploads'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useClients, useMessages } from 'src/hooks'
import { showApiRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies, HashFile, Products } from 'src/types/global'

const useAudio = (prompt: string, hashFile: HashFile | null) => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

  if (!hashFile || !settings || !currConversation) return

  const createTranscriptionByOpenAI = async () => {
    const { model, temperature, language, responseFormat } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      const transcription = await openAiClient.audio.transcriptions.create({
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

  const createTranslationByOpenAI = async () => {
    const { model, temperature, responseFormat } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      const translation = await openAiClient.audio.translations.create({
        file: hashFile.file,
        model,
        prompt,
        response_format: responseFormat as AudioResponseFormat,
        temperature
      })

      saveCommonAssistantMessage(translation.text)
    } catch (error) {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranscriptionByAzure = async () => {
    const { temperature, language } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      const buffer = await hashFile.file.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const transcription = await azureClient.getAudioTranscription(
        settings.azureDeploymentName,
        uint8Array,
        {
          prompt,
          temperature,
          language: language === '' ? undefined : language
        }
      )

      saveCommonAssistantMessage(transcription.text)
    } catch (error) {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranslationByAzure = async () => {
    const { temperature } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      const buffer = await hashFile.file.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const translation = await azureClient.getAudioTranslation(
        settings.azureDeploymentName,
        uint8Array,
        {
          prompt,
          temperature
        }
      )

      saveCommonAssistantMessage(translation.text)
    } catch (error) {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const services = {
    [Companies.Azure]: {
      [Products.AudioTranscription]: createTranscriptionByAzure,
      [Products.AudioTranslation]: createTranslationByAzure
    },
    [Companies.OpenAI]: {
      [Products.AudioTranscription]: createTranscriptionByOpenAI,
      [Products.AudioTranslation]: createTranslationByOpenAI
    }
  }

  return services[settings.company]
}

export default useAudio
