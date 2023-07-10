import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { ChatConfiguration } from 'src/configurations/chat'
import { useCompany, useMessages, useSettings } from 'src/hooks'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { OpenAIChatResponse, OpenAIError } from 'src/types/openai'

const useChatCompletion = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const { settings } = useSettings()
  const company = useCompany()
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
      max_tokens,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      stop
    } = currConversation.configuration as ChatConfiguration

    setLoading(true)

    const emptyMessage = pushEmptyMessage({
      question: prompt
    })

    let chat: Response | undefined

    try {
      chat = await company.chat_completion({
        messages: [
          {
            role: 'system',
            content: system_message
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model,
        max_tokens,
        temperature,
        top_p,
        stop: stop.length > 0 ? stop : undefined,
        frequency_penalty,
        presence_penalty,
        stream: true
      })
    } catch {
      toast.error('Network Error.')
      rollBackEmptyMessage()
      setLoading(false)
      return
    }

    const reader = chat.body?.getReader()

    if (!reader) {
      toast.error('Cannot get ReadableStream.')
      setLoading(false)
      return
    }

    // The error which is throwing by OpenAI API.
    if (chat.status !== 200) {
      const { value } = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const chunk = decoder.decode(value, { stream: true })
      const errorData: OpenAIError = JSON.parse(chunk)
      toast.error(errorData.error.message)
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
        toast.error('Stream data parsing error.')
      } finally {
        setLoading(false)
      }
    }

    await read()
    reader.releaseLock()
  }

  return { createChatCompletion }
}

export default useChatCompletion
