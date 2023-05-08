import { useRecoilState } from 'recoil'
import { useConversationChatMessage, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'

const useImage = (question: string) => {
  const [loading, setLoading] = useRecoilState(loadingState)
  const openai = useOpenAI()
  const { pushEmptyMessage, saveMessageToDbAndUpdateConversationState } =
    useConversationChatMessage()

  const createImage = async () => {
    if (loading) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const image = await openai.createImage({
        prompt: question
      })

      const content = image.data.data
        .map((val, key) => `![${question}-${key}](${val.url})\n`)
        .join('')

      saveMessageToDbAndUpdateConversationState(emptyMessage, content)
    } catch (error) {
      showErrorToast(error)
    } finally {
      setLoading(false)
    }
  }

  return { createImage }
}

export default useImage
