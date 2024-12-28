import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { conversationState } from 'src/stores/conversation'
import { companyState, loadingState, settingsState } from 'src/stores/global'
import { Companies } from 'src/types/global'

const useTTS = () => {
  const { openAiClient } = useClients()
  const conversation = useRecoilValue(conversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const company = useRecoilValue(companyState)

  if (!settings || !conversation) return

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

  const services = {
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[company]
}

export default useTTS
