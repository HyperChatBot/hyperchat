import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useSTT = () => {
  const { openAiClient } = useClients()
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

  const services = {
    [Companies.OpenAI]: createSpeechByOpenAI
  }

  return services[settings.company]
}

export default useSTT
