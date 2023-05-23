import { useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { OPENAI_CHAT_COMPLETION_URL } from 'src/shared/constants'
import { generateErrorMessage } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { ErrorType } from 'src/types/global'
import { OpenAIChatResponse, OpenAIError } from 'src/types/openai'
import useMessages from './useMessages'
import useSettings from './useSettings'

const useChatStream = (question: string) => {
  const { settings } = useSettings()
  const setLoading = useSetRecoilState(loadingState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState,
    rollBackEmptyMessage
  } = useMessages()

  const createChatCompletion = async () => {
    if (!settings) return

    setLoading(true)

    const emptyMessage = pushEmptyMessage({
      question
    })

    let chat: Response | undefined

    try {
      chat = await fetch(OPENAI_CHAT_COMPLETION_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.openai_secret_key}`,
          'OpenAI-Organization': settings.openai_organization_id
        },
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: question
            }
          ],
          model: settings.chat_model,
          stream: settings.chat_stream,
          user: settings.openai_author_name
        })
      })
    } catch {
      // Do nothing, the error will be catched by the following `chat.status !== 200` phrase.
      return
    }

    const reader = chat.body?.getReader()

    if (!reader) {
      toast.error(
        generateErrorMessage(ErrorType.Unknown, 'Cannot get ReadableStream.')
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
        generateErrorMessage(ErrorType.OpenAI, errorData.error.message)
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
        generateErrorMessage(ErrorType.Unknown, 'Stream data parsing error.')
      } finally {
        setLoading(false)
      }
    }

    await read()
    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useChatStream
