import { useRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { OPENAI_CHAT_COMPLETION_URL } from 'src/shared/constants'
import { generateErrorMessage, showErrorToast } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { ErrorType } from 'src/types/global'
import { OpenAIChatResponse, OpenAIError } from 'src/types/openai'
import useConversationChatMessage from './useConversationChatMessage'
import useSettings from './useSettings'

const useChatCompletionStream = (question: string) => {
  const { settings } = useSettings()
  const [loading, setLoading] = useRecoilState(loadingState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState
  } = useConversationChatMessage()

  const createChatCompletion = async () => {
    if (loading) return

    setLoading(true)

    const emptyMessage = pushEmptyMessage({
      question
    })

    const chat = await fetch(OPENAI_CHAT_COMPLETION_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings?.secret_key as string}`
      },
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: question
          }
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
        user: ''
      })
    })

    const reader = chat.body?.getReader()

    if (!reader) {
      toast.error(
        generateErrorMessage(ErrorType.Unknown, 'Cannot read ReadableStream.')
      )
      return
    }

    if (chat.status !== 200) {
      const { value } = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const chunk = decoder.decode(value, { stream: true })
      const errorData: OpenAIError = JSON.parse(chunk)
      toast.error(
        generateErrorMessage(ErrorType.OpenAI, errorData.error.message)
      )
      return
    }

    let _content = ''

    const decoder = new TextDecoder('utf-8')
    try {
      const read = async (): Promise<any> => {
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
            _content = content
          }
        })

        return read()
      }

      await read()
    } catch (error) {
      showErrorToast(error)
    } finally {
    }

    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useChatCompletionStream
