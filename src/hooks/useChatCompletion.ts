import Anthropic, { AnthropicError } from '@anthropic-ai/sdk'
import { enqueueSnackbar } from 'notistack'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useClients, useSettings, useStoreMessages } from 'src/hooks'
import {
  checkUserPromptTokensCountIsValid,
  collectOpenAiPrompt,
  computeContext,
  getTokensCount,
  showRequestErrorToast
} from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import {
  transformContextToGoogle,
  transformToGoogle
} from 'src/transformer/google'
import {
  transformContextToOpenAI,
  transformToOpenAI
} from 'src/transformer/openai'
import { ContentPart, Roles } from 'src/types/conversation'
import { Companies } from 'src/types/global'

const useChatCompletion = () => {
  const { openAiClient, googleClient, anthropicClient } = useClients()
  const currConversation = useRecoilValue(currConversationState)
  const { settings } = useSettings()
  const setLoading = useSetRecoilState(loadingState)
  const {
    rollbackMessage,
    saveUserMessage,
    saveAssistantMessage,
    updateChatCompletionStream
  } = useStoreMessages()

  if (!settings || !currConversation) return

  const createChatCompletionByOpenAI = async (userPrompt: ContentPart) => {
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
    } = currConversation.configuration
    let userMessageText = ''

    const userPromptTokenCount = getTokensCount(
      collectOpenAiPrompt(userPrompt),
      model
    )
    checkUserPromptTokensCountIsValid(0, 104856, userPromptTokenCount)
    await saveUserMessage(userPrompt, userPromptTokenCount)

    const contexts = computeContext(
      104856 - 0 - userPromptTokenCount,
      currConversation.messages
    )

    try {
      let assistantText = ''
      const events = await openAiClient.chat.completions.create({
        model,
        messages: [
          {
            role: Roles.System,
            content: systemMessage
          },
          ...transformContextToOpenAI(contexts),
          {
            role: Roles.User,
            content: transformToOpenAI(userPrompt)
          }
        ],
        stream: true
      })

      if (events)
        for await (const event of events) {
          for (const choice of event.choices) {
            const { content } = choice.delta

            if (content) {
              assistantText += content
              updateChatCompletionStream(content)
            }

            if (choice.delta.refusal) {
              continue
            }
            if (choice.delta.refusal) {
              enqueueSnackbar(choice.delta.refusal, { variant: 'error' })
            }
          }
        }

      const assistantMessageTokenCount = getTokensCount(assistantText, model)
      saveAssistantMessage(assistantMessageTokenCount)
    } catch (e) {
      showRequestErrorToast(e)
    } finally {
      setLoading(false)
    }
  }

  const createChatCompletionByGoogle = async (userPrompt: ContentPart) => {
    const model = googleClient.getGenerativeModel({
      model: 'gemini-2.0-flash-exp'
    })

    const { parts } = transformToGoogle(Roles.User, userPrompt)
    const { totalTokens: userPromptTokenCount } = await model.countTokens(parts)

    checkUserPromptTokensCountIsValid(0, 104856, userPromptTokenCount)
    await saveUserMessage(userPrompt, userPromptTokenCount)

    const contexts = computeContext(
      104856 - 0 - userPromptTokenCount,
      currConversation.messages
    )

    let assistantMessageTokenCount = 0
    const chat = model.startChat({
      history: transformContextToGoogle(contexts)
    })
    const { stream } = await chat.sendMessageStream(parts)
    for await (const chunk of stream) {
      const chunkText = chunk.text()
      updateChatCompletionStream(chunkText)

      const { candidatesTokenCount } = chunk.usageMetadata
      if (candidatesTokenCount) {
        assistantMessageTokenCount = candidatesTokenCount
      }
    }

    saveAssistantMessage(assistantMessageTokenCount)
  }

  const createChatCompletionByAnthropic = async (userMessage: ContentPart) => {
    const { input_tokens } = await anthropicClient.beta.messages.countTokens({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'user', content: 'Hello, world' }]
    })
    await saveUserMessage(userMessage, input_tokens)

    const stream = anthropicClient.messages
      .stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: 'Say hello there!'
          }
        ]
      })
      .on('text', (textDelta) => {
        updateChatCompletionStream(textDelta || '')
      })
      .on('finalMessage', (message) => {
        const { usage } = message
        saveAssistantMessage(usage.output_tokens)
      })
      .on('error', (error: AnthropicError) => {
        if (error instanceof Anthropic.APIError) {
          console.log(error.status) // 400
          console.log(error.name) // BadRequestError
          console.log(error.headers) // {server: 'nginx', ...}
        } else {
          throw error
        }
      })
  }

  const services = {
    [Companies.OpenAI]: createChatCompletionByOpenAI,
    [Companies.Anthropic]: createChatCompletionByAnthropic,
    [Companies.Google]: createChatCompletionByGoogle
  }

  return services[settings.company]
}

export default useChatCompletion
