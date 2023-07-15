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
      maxTokens,
      temperature,
      topP,
      frequencyPenalty,
      presencePenalty,
      preResponse,
      postResponse
    } = currConversation.configuration as TextCompletionConfiguration

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question: prompt,
        questionTokenCount: 0
      })

      const response = await company.text_completion({
        model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty
      })
      const completion: CreateCompletionResponse = await response.json()

      const preResponseText = preResponse.checked ? preResponse.content : ''
      const postResponseText = postResponse.checked ? postResponse.content : ''

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
