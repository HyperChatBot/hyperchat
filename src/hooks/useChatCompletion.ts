import {
  ChatCompletionChunk,
  ChatCompletionCreateParams,
  ChatCompletionMessageParam
} from 'openai/resources'
import { Stream } from 'openai/streaming'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Toast from 'src/components/Snackbar'
import { ChatConfiguration, models } from 'src/configurations/chatCompletion'
import { useClients, useMessages, useSettings } from 'src/hooks'
import { getTokensCount } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { Companies } from 'src/types/global'

const useChatCompletion = (prompt: string) => {
  const { openAiClient, azureClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const { settings } = useSettings()
  const setLoading = useSetRecoilState(loadingState)
  const {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    updateChatCompletionStream
  } = useMessages()

  if (!settings || !currConversation) return

  const createChatCompletionByAzure = async () => {
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
      Toast.error(
        `This model's maximum context length is ${tokensLimit} tokens. However, you requested ${tokensCount} tokens (${
          tokensCount - maxTokens
        } in the messages, ${maxTokens} in the completion). Please reduce the length of the prompt.`
      )
      return
    }
    const context: ChatCompletionCreateParams['messages'] = []
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

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemMessage
      },
      ...context,
      {
        role: 'user',
        content: prompt
      }
    ]

    const options = {
      model,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      stop: stop.length > 0 ? stop : undefined,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
    }

    try {
      const events = await azureClient.streamChatCompletions(
        settings.azureDeploymentName,
        messages,
        options
      )

      for await (const event of events) {
        for (const choice of event.choices) {
          updateChatCompletionStream(choice.delta?.content || '')

          const filterResults = choice.contentFilterResults
          if (!filterResults) {
            continue
          }
          if (filterResults.error) {
            Toast.error(
              `\tContent filter ran into an error ${filterResults.error.code}: ${filterResults.error.message}`
            )
          } else {
            const { hate, sexual, selfHarm, violence } = filterResults

            if (hate?.filtered) {
              Toast.error(
                `\tHate category is filtered: ${hate?.filtered}, with ${hate?.severity} severity`
              )
            }
            if (sexual?.filtered) {
              Toast.error(
                `\tSexual category is filtered: ${sexual?.filtered}, with ${sexual?.severity} severity`
              )
            }
            if (selfHarm?.filtered) {
              Toast.error(
                `\tSelf-harm category is filtered: ${selfHarm?.filtered}, with ${selfHarm?.severity} severity`
              )
            }
            if (violence?.filtered) {
              Toast.error(
                `\tViolence category is filtered: ${violence?.filtered}, with ${violence?.severity} severity`
              )
            }
          }
        }
      }

      saveAssistantMessage()
    } catch (e) {
      Toast.error(e as string)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const createChatCompletionByOpenAI = async () => {
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
      Toast.error(
        `This model's maximum context length is ${tokensLimit} tokens. However, you requested ${tokensCount} tokens (${
          tokensCount - maxTokens
        } in the messages, ${maxTokens} in the completion). Please reduce the length of the prompt.`
      )
      return
    }
    const context: ChatCompletionCreateParams['messages'] = []
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

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemMessage
      },
      ...context,
      {
        role: 'user',
        content: prompt
      }
    ]

    const options = {
      model,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      stop: stop.length > 0 ? stop : undefined,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
    }

    try {
      const events = (await openAiClient.chat.completions.create({
        messages,
        ...options,
        stream: true
      })) as unknown as Stream<ChatCompletionChunk>

      if (events)
        for await (const event of events) {
          for (const choice of event.choices) {
            updateChatCompletionStream(choice.delta?.content || '')

            if (choice.delta.refusal) {
              continue
            }
            if (choice.delta.refusal) {
              Toast.error(choice.delta.refusal)
            }
          }
        }

      saveAssistantMessage()
    } catch (e) {
      Toast.error(e as string)
      rollbackMessage()
    } finally {
      setLoading(false)
    }
  }

  const services = {
    [Companies.Azure]: createChatCompletionByAzure,
    [Companies.OpenAI]: createChatCompletionByOpenAI
  }

  return services[settings.company]
}

export default useChatCompletion
