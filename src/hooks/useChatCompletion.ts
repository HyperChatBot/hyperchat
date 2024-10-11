import { enqueueSnackbar } from 'notistack'
import {
  ChatCompletionChunk,
  ChatCompletionCreateParams,
  ChatCompletionMessageParam
} from 'openai/resources'
import { Stream } from 'openai/streaming'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ChatConfiguration, models } from 'src/configurations/chatCompletion'
import { useClients, useMessages, useSettings } from 'src/hooks'
import { getTokensCount, showRequestErrorToast } from 'src/shared/utils'
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
      enqueueSnackbar(
        `This model's maximum context length is ${tokensLimit} tokens. However, you requested ${tokensCount} tokens (${
          tokensCount - maxTokens
        } in the messages, ${maxTokens} in the completion). Please reduce the length of the prompt.`,
        { variant: 'error' }
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
        settings.azureDeploymentNameChatCompletion,
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
            enqueueSnackbar(
              `\tContent filter ran into an error ${filterResults.error.code}: ${filterResults.error.message}`,
              { variant: 'error' }
            )
          } else {
            const { hate, sexual, selfHarm, violence } = filterResults

            if (hate?.filtered) {
              enqueueSnackbar(
                `\tHate category is filtered: ${hate?.filtered}, with ${hate?.severity} severity`,
                { variant: 'error' }
              )
            }
            if (sexual?.filtered) {
              enqueueSnackbar(
                `\tSexual category is filtered: ${sexual?.filtered}, with ${sexual?.severity} severity`,
                { variant: 'error' }
              )
            }
            if (selfHarm?.filtered) {
              enqueueSnackbar(
                `\tSelf-harm category is filtered: ${selfHarm?.filtered}, with ${selfHarm?.severity} severity`,
                { variant: 'error' }
              )
            }
            if (violence?.filtered) {
              enqueueSnackbar(
                `\tViolence category is filtered: ${violence?.filtered}, with ${violence?.severity} severity`,
                { variant: 'error' }
              )
            }
          }
        }
      }

      saveAssistantMessage()
    } catch (e) {
      showRequestErrorToast(e)
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
      enqueueSnackbar(
        `This model's maximum context length is ${tokensLimit} tokens. However, you requested ${tokensCount} tokens (${
          tokensCount - maxTokens
        } in the messages, ${maxTokens} in the completion). Please reduce the length of the prompt.`,
        { variant: 'error' }
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
              enqueueSnackbar(choice.delta.refusal, { variant: 'error' })
            }
          }
        }

      saveAssistantMessage()
    } catch (e) {
      showRequestErrorToast(e)
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
