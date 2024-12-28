import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { conversationState } from 'src/stores/conversation'
import { companyState, loadingState, settingsState } from 'src/stores/global'
import { Companies } from 'src/types/global'

const useSTT = () => {
  const { openAiClient } = useClients()
  const conversation = useRecoilValue(conversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const company = useRecoilValue(companyState)

  if (!settings || !conversation) return

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

  const services = {
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[company]
}

export default useSTT
