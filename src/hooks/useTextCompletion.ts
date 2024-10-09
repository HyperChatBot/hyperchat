import { Completion } from 'openai/resources'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TextCompletionConfiguration } from 'src/configurations/textCompletion'
import { useMessages, useServices } from 'src/hooks'
import { showApiRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

const useTextCompletion = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const services = useServices()
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

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
      saveUserMessage(prompt)
      setLoading(true)

      const response = await services.text_completion({
        model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty
      })
      const completion: Completion = await response.json()

      const preResponseText = preResponse.checked ? preResponse.content : ''
      const postResponseText = postResponse.checked ? postResponse.content : ''

      saveCommonAssistantMessage(
        preResponseText + (completion.choices[0].text || '') + postResponseText
      )
    } catch (error) {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createTextCompletion }
}

export default useTextCompletion
