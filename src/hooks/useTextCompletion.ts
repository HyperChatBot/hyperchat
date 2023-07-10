import { CreateCompletionResponse } from 'openai'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TextCompletionConfiguration } from 'src/configurations/textCompletion'
import { useCompany, useMessages } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useTextCompletion = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const company = useCompany()
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createTextCompletion = async () => {
    if (!settings || !currConversation) return

    const {
      model,
      max_tokens,
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
        question: prompt
      })

      const response = await company.text_completion({
        model,
        prompt: prompt,
        max_tokens,
        temperature,
        top_p,
        frequency_penalty,
        presence_penalty
      })
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

export default useTextCompletion
