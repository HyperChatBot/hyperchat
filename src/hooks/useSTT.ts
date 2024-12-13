import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useSTT = () => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)

  if (!settings || !currConversation) return

  const createSpeechByOpenAI = async (blob: Blob[]) => {
    try {
      setLoading(true)

      const transcription = await openAiClient.audio.transcriptions.create({
        file: new File(blob, 'record.mp3', { lastModified: +new Date() }),
        model: 'whisper-1'
      })

      return transcription.text
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createSpeechByAzure = async (blob: Blob[]) => {
    const audioBlob = new Blob(blob, {
      type: 'audio/mp3'
    })
    const uint8Array = new Uint8Array(await audioBlob.arrayBuffer())
    const transcription = await azureClient.getAudioTranscription(
      settings.azureDeploymentNameAudioGeneration,
      uint8Array
    )

    return transcription.text
  }

  const services = {
    [Companies.Azure]: createSpeechByAzure,
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[settings.company]
}

export default useSTT
