import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { ChatConfiguration } from 'src/configurations/chat'
import { generateErrorMessage } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { ErrorType } from 'src/types/global'
import { OpenAIChatResponse, OpenAIError } from 'src/types/openai'
import useMessages from './useMessages'
import useSettings from './useSettings'

const useAzureChatStream = (question: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const { settings } = useSettings()
  const setLoading = useSetRecoilState(loadingState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState,
    rollBackEmptyMessage
  } = useMessages()

  const createChatCompletion = async () => {
    if (!settings || !currConversation) return

    const {
      model,
      system_message,
      max_response,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty
    } = currConversation.configuration as ChatConfiguration

    setLoading(true)

    const emptyMessage = pushEmptyMessage({
      question
    })

    let chat: Response | undefined

    try {
      chat = await fetch(
        `${settings.azure_endpoint}/openai/deployments/${settings.azure_deployment_name}/chat/completions?api-version=2023-03-15-preview`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': settings.azure_secret_key
          },
          method: 'POST',
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: system_message
              },
              {
                role: 'user',
                content: question
              }
            ],
            model,
            max_response,
            temperature,
            top_p,
            frequency_penalty,
            presence_penalty,
            stream: true
          })
        }
      )
    } catch {
      // Do nothing, the error will be catched by the following `chat.status !== 200` phrase.
      return
    }

    const reader = chat.body?.getReader()

    if (!reader) {
      toast.error(
        generateErrorMessage(ErrorType.Azure, 'Cannot get ReadableStream.')
      )
      setLoading(false)
      return
    }

    // The error which is throwing by OpenAI API.
    if (chat.status !== 200) {
      const { value } = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const chunk = decoder.decode(value, { stream: true })
      const errorData: OpenAIError = JSON.parse(chunk)
      toast.error(
        generateErrorMessage(ErrorType.Azure, errorData.error.message)
      )
      rollBackEmptyMessage()
      setLoading(false)
      return
    }

    let _content = ''

    const decoder = new TextDecoder('utf-8')
    const read = async (): Promise<void> => {
      try {
        const { done, value } = await reader.read()

        if (done) {
          setLoading(false)
          saveMessageToDbAndUpdateConversationState(emptyMessage, _content)
          return reader.releaseLock()
        }

        const chunk = decoder.decode(value, { stream: true })
        const chunks: OpenAIChatResponse[] = chunk
          .split('data:')
          .map((data) => {
            const trimData = data.trim()
            if (trimData === '') return undefined
            if (trimData === '[DONE]') return undefined
            return JSON.parse(data.trim())
          })
          .filter((data) => data)
        chunks.forEach((data) => {
          const token = data.choices[0].delta.content

          if (token !== undefined) {
            const content = updateStreamState(token)
            _content += content
          }
        })

        return read()
      } catch {
        generateErrorMessage(ErrorType.Azure, 'Stream data parsing error.')
      } finally {
        setLoading(false)
      }
    }

    await read()
    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useAzureChatStream
