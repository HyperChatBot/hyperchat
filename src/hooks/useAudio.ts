import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { HashFile } from 'src/types/global'

const useAudio = (question: string, hashFile: HashFile | null) => {
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const openai = useOpenAI()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createTranscription = async () => {
    if (!hashFile) return
    if (!settings) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question,
        file_name: hashFile.hashName
      })

      const transcription = await openai.createTranscription(
        hashFile.file,
        settings.audio_transcription_model,
        question,
        settings.audio_response_type
      )

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        transcription.data.text
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async () => {
    if (!settings) return
    if (!hashFile) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question,
        file_name: hashFile.hashName
      })

      const translation = await openai.createTranslation(
        hashFile.file,
        settings.audio_translation_model,
        question
      )

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        translation.data.text
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
