import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMessages, useOpenAI } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useEdit = (question: string) => {
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const openai = useOpenAI()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createEdit = async () => {
    if (!settings) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const {
        data: { choices }
      } = await openai.createEdit({
        model: settings.edit_model,
        input: question,
        instruction: 'Fix the spelling mistakes'
      })

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        choices[0].text || ''
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createEdit }
}

export default useEdit
