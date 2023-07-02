import { CreateCompletionResponse } from 'openai'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TextCompletionConfiguration } from 'src/configurations/textCompletion'
import { useMessages } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useAzureTextCompletion = (question: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createTextCompletion = async () => {
    if (!settings || !currConversation) return

    const {
      model,
      max_response,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      pre_response_text,
      post_response_text
    } = currConversation.configuration as TextCompletionConfiguration

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
            model,
            prompt: question,
            max_tokens: max_response,
            temperature,
            top_p,
            frequency_penalty,
            presence_penalty
          })
        }
      )
      const completion: CreateCompletionResponse = await response.json()

      const preResponseText = pre_response_text.checked
        ? pre_response_text.content
        : ''
      const postResponseText = post_response_text.checked
        ? post_response_text.content
        : ''

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        preResponseText + (completion.choices[0].text || '') + postResponseText
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

export default useAzureTextCompletion
