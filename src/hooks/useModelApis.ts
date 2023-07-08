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

const useModelApis = (prompt: string, hashFile: HashFile) => {
  const { createChatCompletion: createOpenAIChatCompletion } =
    useOpenAIChatStream(prompt)
  const { createChatCompletion: createAzureChatCompletion } =
    useAzureChatStream(prompt)
  const { createTextCompletion: createOpenAITextCompletion } =
    useOpenAITextCompletion(prompt)
  const { createTextCompletion: createAzureTextCompletion } =
    useAzureTextCompletion(prompt)
  const { createImageGeneration: createOpenAIImageGeneration } =
    useOpenAIImage(prompt)
  const { createImageGeneration: createAzureImageGeneration } =
    useAzureImageGeneration(prompt)
  const {
    createTranscription: createOpenAITranscription,
    createTranslation: createOpenAITranslation
  } = useOpenAIAudio(prompt, hashFile)

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
