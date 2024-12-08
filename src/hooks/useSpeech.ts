import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useSpeech = () => {
  const { openAiClient, azureSpeechClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)

  if (!settings || !currConversation) return

  const createSpeechByOpenAI = async (text: string) => {
    try {
      setLoading(true)

      const speech = await openAiClient.audio.speech.create({
        model: 'tts-1',
        input: text,
        voice: 'nova'
      })
      const audioBlob = await speech.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      return audioUrl
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createSpeechByAzure = (text: string): Promise<string> =>
    new Promise((resolve, reject) => {
      azureSpeechClient.speakTextAsync(
        text,
        (result) => {
          const { audioData } = result
          azureSpeechClient.close()
          const audioBlob = new Blob([audioData])
          const audioUrl = URL.createObjectURL(audioBlob)
          resolve(audioUrl)
        },
        (error) => {
          azureSpeechClient.close()
          reject(error)
        }
      )
    })

  const services = {
    [Companies.Azure]: createSpeechByAzure,
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[settings.company]
}

export default useSpeech
