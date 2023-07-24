import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { AudioTranscriptionConfiguration } from 'src/configurations/audioTranscription'
import { AudioTranslationConfiguration } from 'src/configurations/audioTranslation'
import { useMessages, useOpenAI } from 'src/hooks'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { HashFile } from 'src/types/global'

const useAudio = (prompt: string, hashFile: HashFile | null) => {
  const currConversation = useRecoilValue(currConversationState)
  const settings = useRecoilValue(settingsState)
  const setLoading = useSetRecoilState(loadingState)
  const openai = useOpenAI()
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

  const createTranscription = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, language, responseFormat } =
      currConversation.configuration as AudioTranscriptionConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      // TODO: Uses pure fetch.
      const transcription = await openai.createTranscription(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature,
        language === '' ? undefined : language
      )
      if (transcription.error) {
        throw new Error(transcription.error.message)
      }

      saveCommonAssistantMessage(
        // If `responseFormat` is `json` or `verbose_json`, the result is `transcription.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `transcription.data`.
        transcription.data.text || (transcription.data as unknown as string)
      )
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error(error)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async () => {
    if (!hashFile || !settings || !currConversation) return

    const { model, temperature, responseFormat } =
      currConversation.configuration as AudioTranslationConfiguration

    try {
      saveUserMessage(prompt, 0, hashFile.hashName)
      setLoading(true)

      // TODO: Uses pure fetch.
      const translation = await openai.createTranslation(
        hashFile.file,
        model,
        prompt,
        responseFormat,
        temperature
      )
      if (translation.error) {
        throw new Error(translation.error.message)
      }

      saveCommonAssistantMessage(
        // If `responseFormat` is `json` or `verbose_json`, the result is `translation.data.text`.
        // If `responseFormat` is `text`, `vtt` `or `srt`, the result is `translation.data`.
        translation.data.text || (translation.data as unknown as string)
      )
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error(error)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTranslation, createTranscription }
}

export default useAudio
