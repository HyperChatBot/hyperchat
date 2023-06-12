import { AI_PROMPT, Client, HUMAN_PROMPT } from '@anthropic-ai/sdk'
import { useSetRecoilState } from 'recoil'
import toast from 'src/components/Snackbar'
import { generateErrorMessage } from 'src/shared/utils'
import { loadingState } from 'src/stores/conversation'
import { ErrorType } from 'src/types/global'
import useMessages from './useMessages'
import useSettings from './useSettings'

const useAnthropicChatStream = (question: string) => {
  const { settings } = useSettings()
  const setLoading = useSetRecoilState(loadingState)
  const {
    pushEmptyMessage,
    saveMessageToDbAndUpdateConversationState,
    updateStreamState,
    rollBackEmptyMessage
  } = useMessages()

  const createChatCompletion = async () => {
    if (!settings) {
      return
    }

    const client = new Client(settings.anthropic_secret_key)

    setLoading(true)
    const emptyMessage = pushEmptyMessage({
      question
    })

    client
      .completeStream(
        {
          prompt: `${HUMAN_PROMPT} ${question}${AI_PROMPT}`,
          stop_sequences: [HUMAN_PROMPT],
          max_tokens_to_sample: 200,
          model: 'claude-v1'
        },
        {
          onOpen: (response) => {
            // Do nothing.
          },
          onUpdate: (completion) => {
            updateStreamState(completion.completion)
          }
        }
      )
      .then((completion) => {
        saveMessageToDbAndUpdateConversationState(
          emptyMessage,
          completion.completion
        )
      })
      .catch((error) => {
        toast.error(
          generateErrorMessage(ErrorType.Anthropic, JSON.stringify(error))
        )
        rollBackEmptyMessage()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { createChatCompletion }
}

export default useAnthropicChatStream
