import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ImageGenerationConfiguration } from 'src/configurations/imageGeneration'
import { useClients, useMessages } from 'src/hooks'
import { showApiRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useImageGeneration = (prompt: string) => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

  if (!settings || !currConversation) return

  const createImageGenerationByOpenAI = async () => {
    const { n, size, responseFormat } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(prompt)
      setLoading(true)
      const image = await openAiClient.images.generate({
        prompt,
        n,
        size,
        response_format: responseFormat
      })

      const content = image.data
        .map((val, key) => `![${prompt}-${key}](${val.url})\n`)
        .join('')

      saveCommonAssistantMessage(content)
    } catch {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createImageGenerationByAzure = async () => {
    const { n, size, responseFormat } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(prompt)
      setLoading(true)
      const image = await azureClient.getImages(
        settings.azureDeploymentName,
        prompt,
        {
          n,
          size,
          responseFormat
        }
      )

      const content = image.data
        .map((val, key) => `![${prompt}-${key}](${val.url})\n`)
        .join('')

      saveCommonAssistantMessage(content)
    } catch {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const services = {
    [Companies.Azure]: createImageGenerationByAzure,
    [Companies.OpenAI]: createImageGenerationByOpenAI
  }

  return services[settings.company]
}

export default useImageGeneration
