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
        `${settings.azure_endpoint}/openai/deployments/${settings.azure_deployment_name}/completions?api-version=2022-12-01`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': settings.azure_secret_key
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
