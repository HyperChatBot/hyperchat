import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ImageGenerationConfiguration } from 'src/configurations/imageGeneration'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useOpenAIImageGeneration = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const openai = useOpenAI()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createImageGeneration = async () => {
    if (!settings || !currConversation) return

    const { n, size, response_format } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question: prompt
      })

      const image = await openai.createImage({
        prompt: prompt,
        n,
        size,
        response_format
      })

      const content = image.data.data
        .map((val, key) => `![${prompt}-${key}](${val.url})\n`)
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
