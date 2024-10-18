import { ChatCompletionContentPartText } from 'openai/resources'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ImageGenerationConfiguration } from 'src/configurations/imageGeneration'
import { useClients, useStoreMessages } from 'src/hooks'
import { showRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { Companies } from 'src/types/global'

const useImageGeneration = () => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const { saveUserMessage, saveCommonAssistantMessage } = useStoreMessages()

  if (!settings || !currConversation) return

  const createImageGenerationByOpenAI = async (
    imageGenerationTextContent: ChatCompletionContentPartText[]
  ) => {
    const { n, size, responseFormat } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(imageGenerationTextContent)
      setLoading(true)
      const image = await openAiClient.images.generate({
        prompt: imageGenerationTextContent[0].text,
        n,
        size,
        response_format: responseFormat
      })

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: image.data
            .map((val, key) => `![${prompt}-${key}](${val.url})\n`)
            .join(''),
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

  const createImageGenerationByAzure = async (
    imageGenerationTextContent: ChatCompletionContentPartText[]
  ) => {
    const { n, size, responseFormat } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(imageGenerationTextContent)
      setLoading(true)
      const image = await azureClient.getImages(
        settings.azureDeploymentNameTextToImage,
        imageGenerationTextContent[0].text,
        {
          n,
          size,
          responseFormat
        }
      )

      const assistantContent: ChatCompletionContentPartText[] = [
        {
          text: image.data
            .map((val, key) => `![${prompt}-${key}](${val.url})\n`)
            .join(''),
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
    [Companies.Azure]: createImageGenerationByAzure,
    [Companies.OpenAI]: createImageGenerationByOpenAI
  }

  return services[settings.company]
}

export default useImageGeneration
