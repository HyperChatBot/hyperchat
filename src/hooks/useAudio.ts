import { useRecoilState } from 'recoil'
import { useConversationChatMessage, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { HashFile } from 'src/types/global'

const useAudio = (question: string, hashFile: HashFile | null) => {
  const [loading, setLoading] = useRecoilState(loadingState)
  const openai = useOpenAI()
  const { pushEmptyMessage, saveMessageToDbAndUpdateConversationState } =
    useConversationChatMessage()

  const createTranscription = async () => {
    if (loading) return
    if (!hashFile) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question,
        file_name: hashFile.hashName
      })

      const transcription = await openai.createTranscription(
        hashFile.file,
        'whisper-1',
        question
      )

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        transcription.data.text
      )
    } catch (error) {
      showErrorToast(error)
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async () => {
    if (loading) return
    if (!hashFile) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question,
        file_name: hashFile.hashName
      })

      const transcription = await openai.createTranslation(
        hashFile.file,
        'whisper-1',
        question
      )

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        transcription.data.text
      )
    } catch (error) {
      showErrorToast(error)
    } finally {
      setLoading(false)
    }
  }

  return { createTranslation, createTranscription }
}

export default useAudio
