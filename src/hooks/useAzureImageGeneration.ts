import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMessages } from 'src/hooks'
import { showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'
import { AzureImageGeneration } from 'src/types/azure'
import { sleep } from 'yancey-js-util'

const useImage = (question: string) => {
  const setLoading = useSetRecoilState(loadingState)
  const settings = useRecoilValue(settingsState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    rollBackEmptyMessage
  } = useMessages()

  const createImage = async () => {
    if (!settings) return

    try {
      setLoading(true)

      const emptyMessage = pushEmptyMessage({
        question
      })

      const headers = {
        'Content-Type': 'application/json',
        'api-key': import.meta.env.VITE_AZURE
      }

      const submission = await fetch(
        'https://yancey-openai.openai.azure.com/dalle/text-to-image?api-version=2022-08-03-preview',
        {
          headers,
          method: 'POST',
          body: JSON.stringify({
            caption: question,
            resolution: settings.image_generation_size
          })
        }
      )

      const operation_location = submission.headers.get('Operation-Location')
      if (!operation_location) throw new Error('No Operation Location found.')
      let retry_after = Number(submission.headers.get('Retry-after')) * 1000
      let image: AzureImageGeneration | null = null

      while (image?.status !== 'Succeeded') {
        sleep(retry_after)

        const response = await fetch(operation_location, {
          headers,
          method: 'GET'
        })
        retry_after = Number(response.headers.get('Retry-after')) * 1000
        image = (await response.json()) as AzureImageGeneration
      }

      saveMessageToDbAndUpdateConversationState(
        emptyMessage,
        `![${question}](${image.result.contentUrl})`
      )
    } catch (error) {
      showErrorToast(error)
      rollBackEmptyMessage()
    } finally {
      setLoading(false)
    }
  }

  return { createImage }
}

export default useImage
