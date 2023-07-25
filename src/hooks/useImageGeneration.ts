import { DateTime } from 'luxon'
import { ImagesResponse } from 'openai'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ImageGenerationConfiguration } from 'src/configurations/imageGeneration'
import { useMessages, useServices } from 'src/hooks'
import { showApiRequestErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { AzureImageGeneration } from 'src/types/azure'
import { Companies } from 'src/types/global'
import { sleep } from 'yancey-js-util'

const useImageGeneration = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const services = useServices()
  const { rollbackMessage, saveUserMessage, saveCommonAssistantMessage } =
    useMessages()

  const createOpenAIImageGeneration = async () => {
    if (!settings || !currConversation) return

    const { n, size, responseFormat } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(prompt)
      setLoading(true)
      const response = await services.image_generation({
        prompt,
        n,
        size,
        response_format: responseFormat
      })
      const image = (await response.json()) as ImagesResponse

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

  const createAzureImageGeneration = async () => {
    if (!settings || !currConversation) return

    const { n, size } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      saveUserMessage(prompt)
      setLoading(true)

      const submission = await services.image_generation({
        prompt: prompt,
        n,
        size
      })

      if (submission.status !== 200) {
        throw new Error('Request image generation error.')
      }

      const operation_location = submission.headers.get('Operation-Location')
      if (!operation_location) throw new Error('No Operation Location found.')
      let retry_after = Number(submission.headers.get('Retry-after')) * 1000
      let image: AzureImageGeneration | null = null

      while (image?.status !== 'succeeded') {
        sleep(retry_after)

        const response = await fetch(operation_location, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': settings.azureSecretKey
          },
          method: 'GET'
        })
        retry_after = Number(response.headers.get('Retry-after')) * 1000
        image = (await response.json()) as AzureImageGeneration
      }

      let content = ''
      image.result.data.forEach(
        (image) => (content += `![${prompt}](${image.url})\n\n`)
      )
      content += `(Warning: The expiration date of this image is **${DateTime.fromSeconds(
        image.expires
      ).toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}**, please download as soon as possible.)`

      saveCommonAssistantMessage(content)
    } catch {
      showApiRequestErrorToast()
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  return settings?.company === Companies.OpenAI
    ? { createImageGeneration: createOpenAIImageGeneration }
    : { createImageGeneration: createAzureImageGeneration }
}

export default useImageGeneration
