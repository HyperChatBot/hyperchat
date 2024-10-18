import { ChatCompletionContentPartText } from 'openai/resources'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { CompletionConfiguration } from 'src/configurations/completion'
import { useClients, useStoreMessages } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useCompletion = () => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const { saveUserMessage, saveCommonAssistantMessage } = useStoreMessages()

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
  } = currConversation.configuration as CompletionConfiguration

  const createCompletionByOpenAI = async (
    completionTextContent: ChatCompletionContentPartText[]
  ) => {
    try {
      saveUserMessage(completionTextContent)
      setLoading(true)

      const completion = await openAiClient.completions.create({
        model,
        prompt: completionTextContent[0].text,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty
      })

      const preResponseText = preResponse.checked ? preResponse.content : ''
      const postResponseText = postResponse.checked ? postResponse.content : ''

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text:
            preResponseText +
            (completion.choices[0].text || '') +
            postResponseText,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createCompletionByAzure = async (
    completionTextContent: ChatCompletionContentPartText[]
  ) => {
    try {
      saveUserMessage(completionTextContent)
      setLoading(true)

      const completion = await azureClient.getCompletions(
        settings.azureDeploymentNameCompletion,
        [completionTextContent[0].text],
        {
          maxTokens,
          temperature,
          topP,
          frequencyPenalty,
          presencePenalty
        }
      )

      const preResponseText = preResponse.checked ? preResponse.content : ''
      const postResponseText = postResponse.checked ? postResponse.content : ''

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text:
            preResponseText +
            (completion.choices[0].text || '') +
            postResponseText,
          type: 'text'
        }
      ]
      saveCommonAssistantMessage(assistantContent)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const services = {
    [Companies.Azure]: createCompletionByAzure,
    [Companies.OpenAI]: createCompletionByOpenAI
  }

  return services[settings.company]
}

export default useCompletion
