import {
  AudioResponseFormat,
  ChatCompletionContentPartText
} from 'openai/resources'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useClients, useStoreMessages } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { AudioContentPart } from 'src/types/conversation'
import { Companies, Products } from 'src/types/global'

const useAudio = () => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const { saveUserMessage, saveCommonAssistantMessage } = useStoreMessages()

  if (!settings || !currConversation) return

  const createTranscriptionByOpenAI = async (
    audioContentPart: AudioContentPart[]
  ) => {
    const { model, temperature, language, responseFormat } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      const { binary, ...rest } = audioContentPart[0]
      saveUserMessage([rest])
      setLoading(true)

      const transcription = await openAiClient.audio.transcriptions.create({
        file: binary,
        model,
        prompt: rest.text,
        response_format: responseFormat as AudioResponseFormat,
        temperature,
        language: language === '' ? undefined : language
      })

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: transcription.text,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createTranslationByOpenAI = async (
    audioContentPart: AudioContentPart[]
  ) => {
    const { model, temperature, responseFormat } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      const { binary, ...rest } = audioContentPart[0]
      saveUserMessage([rest])
      setLoading(true)

      const translation = await openAiClient.audio.translations.create({
        file: binary,
        model,
        prompt: rest.text,
        response_format: responseFormat as AudioResponseFormat,
        temperature
      })

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: translation.text,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createTranscriptionByAzure = async (
    audioContentPart: AudioContentPart[]
  ) => {
    const { temperature, language } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      const { binary, ...rest } = audioContentPart[0]
      saveUserMessage([rest])
      setLoading(true)

      const buffer = await binary.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const transcription = await azureClient.getAudioTranscription(
        settings.azureDeploymentNameSpeechRecognition,
        uint8Array,
        {
          prompt,
          temperature,
          language: language === '' ? undefined : language
        }
      )

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: transcription.text,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createTranslationByAzure = async (
    audioContentPart: AudioContentPart[]
  ) => {
    const { temperature } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      const { binary, ...rest } = audioContentPart[0]
      saveUserMessage([rest])
      setLoading(true)

      const buffer = await binary.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const translation = await azureClient.getAudioTranslation(
        settings.azureDeploymentNameSpeechRecognition,
        uint8Array,
        {
          prompt,
          temperature
        }
      )

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: translation.text,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
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
