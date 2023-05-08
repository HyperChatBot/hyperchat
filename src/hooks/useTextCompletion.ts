import { useRecoilState } from 'recoil'
import { useConversationChatMessage, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'

const useTextCompletion = (question: string) => {
  const [loading, setLoading] = useRecoilState(loadingState)
  const openai = useOpenAI()
  const { pushEmptyMessage, saveMessageToDbAndUpdateConversationState } =
    useConversationChatMessage()

  const createTextCompletion = async () => {
    if (loading) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const {
        data: { id, choices }
      } = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: question
      })

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        choices[0].text || ''
      )
    } catch (error) {
      showErrorToast(error)
    } finally {
      setLoading(false)
    }
  }

  return { createTextCompletion }
}

export default useTextCompletion
