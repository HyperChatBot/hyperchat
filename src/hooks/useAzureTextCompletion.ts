import { CreateCompletionResponse } from 'openai'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMessages } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useTextCompletion = (question: string) => {
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createTextCompletion = async () => {
    if (!settings) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const response = await fetch(
        'https://yancey-openai.openai.azure.com/openai/deployments/hyper-chat/completions?api-version=2022-12-01',
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': import.meta.env.VITE_AZURE
          },
          method: 'POST',
          body: JSON.stringify({
            prompt: question
          })
        }
      )
      const completion: CreateCompletionResponse = await response.json()

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        completion.choices[0].text || ''
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTextCompletion }
}

export default useTextCompletion
