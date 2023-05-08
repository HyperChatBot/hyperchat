import { useRecoilState } from 'recoil'
import { useConversationChatMessage, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'

const useEdit = (question: string) => {
  const [loading, setLoading] = useRecoilState(loadingState)
  const openai = useOpenAI()
  const { pushEmptyMessage, saveMessageToDbAndUpdateConversationState } =
    useConversationChatMessage()

  const createEdit = async () => {
    if (loading) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const {
        data: { choices }
      } = await openai.createEdit({
        model: 'text-davinci-edit-001',
        input: 'What day of the wek is it?',
        instruction: 'Fix the spelling mistakes'
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

  return { createEdit }
}

export default useEdit
