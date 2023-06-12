import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useOpenAIImageGeneration = (question: string) => {
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const openai = useOpenAI()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createImageGeneration = async () => {
    if (!settings) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const image = await openai.createImage({
        prompt: question,
        size: settings.image_generation_size
      })

      const content = image.data.data
        .map((val, key) => `![${question}-${key}](${val.url})\n`)
        .join('')

      saveMessageToDbAndUpdateConversationState(emptyMessage, content)
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createImageGeneration }
}

export default useOpenAIImageGeneration
