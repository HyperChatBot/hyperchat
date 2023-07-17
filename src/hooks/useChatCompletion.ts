import { CreateChatCompletionRequest } from 'openai'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { ChatConfiguration, models } from 'src/configurations/chatCompletion'
import { useCompany, useMessages, useSettings } from 'src/hooks'
import { getTokensCount } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { OpenAIChatResponse, OpenAIError } from 'src/types/openai'

const useChatCompletion = (prompt: string) => {
  const currConversation = useRecoilValue(currConversationState)
  const { settings } = useSettings()
  const company = useCompany()
  const setLoading = useSetRecoilState(loadingState)
  const {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    updateChatCompletionStream
  } = useMessages()

  const createChatCompletion = async () => {
    if (!settings || !currConversation) return

    const {
      model,
      systemMessage,
      maxTokens,
      temperature,
      topP,
      frequencyPenalty,
      presencePenalty,
      stop,
      systemMessageTokensCount
    } = currConversation.configuration as ChatConfiguration

    const userMessageTokensCount = getTokensCount(prompt, model)
    let tokensCount =
      userMessageTokensCount + systemMessageTokensCount + maxTokens
    const tokensLimit = models.find((m) => m.name === model)?.tokensLimit || 0
    if (tokensCount > tokensLimit) {
      toast.error(
        `This model's maximum context length is ${tokensLimit} tokens. However, you requested ${tokensCount} tokens (${
          tokensCount - maxTokens
        } in the messages, ${maxTokens} in the completion). Please reduce the length of the prompt.`
      )
      return
    }
    const context: CreateChatCompletionRequest['messages'] = []
    currConversation.messages
      .slice()
      .reverse()
      .forEach(({ tokensCount: historyTokensCount, content, role }) => {
        tokensCount += historyTokensCount
        if (tokensCount > tokensLimit) return
        context.unshift({
          role,
          content
        })
      })
    saveUserMessage(prompt, userMessageTokensCount)
    setLoading(true)
    updateChatCompletionStream()

    let chat: Response | undefined

    try {
      chat = await company.chat_completion({
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          ...context,
          {
            role: 'user',
            content: prompt
          }
        ],
        model,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        stop: stop.length > 0 ? stop : undefined,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stream: true
      })
    } catch {
      toast.error('Network Error.')
      rollbackMessage()
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
      rollbackMessage()
      setLoading(false)
      return
    }

    const decoder = new TextDecoder('utf-8')
    const read = async (): Promise<void> => {
      try {
        const { done, value } = await reader.read()

        if (done) {
          saveAssistantMessage()
          setLoading(false)
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
            updateChatCompletionStream(token)
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
