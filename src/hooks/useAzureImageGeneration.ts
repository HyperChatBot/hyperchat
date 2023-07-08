import { DateTime } from 'luxon'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ImageGenerationConfiguration } from 'src/configurations/imageGeneration'
import { useMessages } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { AzureImageGeneration } from 'src/types/azure'
import { sleep } from 'yancey-js-util'

const useAzureImageGeneration = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createImageGeneration = async () => {
    if (!settings || !currConversation) return

    const { n, size } =
      currConversation.configuration as ImageGenerationConfiguration

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question: prompt
      })

      const headers = {
        'Content-Type': 'application/json',
        'api-key': settings.azure_secret_key
      }

      const submission = await fetch(
        `${settings.azure_endpoint}/openai/images/generations:submit?api-version=2023-06-01-preview`,
        {
          headers,
          method: 'POST',
          body: JSON.stringify({
            prompt: prompt,
            n,
            size
          })
        }
      )

      const operation_location = submission.headers.get('Operation-Location')
      if (!operation_location) throw new Error('No Operation Location found.')
      let retry_after = Number(submission.headers.get('Retry-after')) * 1000
      let image: AzureImageGeneration | null = null

      while (image?.status !== 'succeeded') {
        sleep(retry_after)

        const response = await fetch(operation_location, {
          headers,
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

      saveMessageToDbAndUpdateConversationState(emptyMessage, content)
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createImageGeneration }
}

export default useAzureImageGeneration
