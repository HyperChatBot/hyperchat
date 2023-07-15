import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { HashFile } from 'src/types/global'

const useAudio = (prompt: string, hashFile: HashFile | null) => {
  const currConversation = useRecoilValue(currConversationState)
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const openai = useOpenAI()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createTranscription = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, language, responseFormat } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question: prompt,
        questionTokenCount: 0,
        fileName: hashFile.hashName
      })

      const transcription = await openai.createTranscription(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature,
        language === '' ? undefined : language
      )

      console.log(transcription)

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        // If `responseFormat` is `json` or `verbose_json`, the result is `transcription.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `transcription.data`.
        transcription.data.text || (transcription.data as unknown as string)
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, responseFormat } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question: prompt,
        questionTokenCount: 0,
        fileName: hashFile.hashName
      })

      const translation = await openai.createTranslation(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature
      )

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        // If `responseFormat` is `json` or `verbose_json`, the result is `translation.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `translation.data`.
        translation.data.text || (translation.data as unknown as string)
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTranslation, createTranscription }
}

export default useAudio
