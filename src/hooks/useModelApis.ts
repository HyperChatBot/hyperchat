import {
  useAzureChatStream,
  useAzureImageGeneration,
  useAzureTextCompletion,
  useOpenAIAudio,
  useOpenAIChatStream,
  useOpenAIImage,
  useOpenAITextCompletion
} from 'src/hooks'
import { HashFile, Products } from 'src/types/global'

const useModelApis = (question: string, hashFile: HashFile) => {
  const { createChatCompletion: createOpenAIChatCompletion } =
    useOpenAIChatStream(question)
  const { createChatCompletion: createAzureChatCompletion } =
    useAzureChatStream(question)
  const { createTextCompletion: createOpenAITextCompletion } =
    useOpenAITextCompletion(question)
  const { createTextCompletion: createAzureTextCompletion } =
    useAzureTextCompletion(question)
  const { createImageGeneration: createOpenAIImageGeneration } =
    useOpenAIImage(question)
  const { createImageGeneration: createAzureImageGeneration } =
    useAzureImageGeneration(question)
  const {
    createTranscription: createOpenAITranscription,
    createTranslation: createOpenAITranslation
  } = useOpenAIAudio(question, hashFile)

  const requests = {
    [Products.OpenAIChat]: createOpenAIChatCompletion,
    [Products.OpenAITextCompletion]: createOpenAITextCompletion,
    [Products.OpenAIAudioTranscription]: createOpenAITranscription,
    [Products.OpenAIAudioTranslation]: createOpenAITranslation,
    [Products.OpenAIImageGeneration]: createOpenAIImageGeneration,
    [Products.AzureChat]: createAzureChatCompletion,
    [Products.AzureTextCompletion]: createAzureTextCompletion,
    [Products.AzureImageGeneration]: createAzureImageGeneration
  }

  return requests
}

export default useModelApis
