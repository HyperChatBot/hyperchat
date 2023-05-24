import {
  useAudio,
  useAzureChatStream,
  useAzureImageGeneration,
  useAzureTextCompletion,
  useChatStream,
  useImage,
  useTextCompletion
} from 'src/hooks'
import { HashFile, Products } from 'src/types/global'

 const useModelApis = (question: string, hashFile: HashFile) => {
  const { createChatCompletion } = useChatStream(question)
  const { createChatCompletion: createAzureChatCompletion } =
    useAzureChatStream(question)
  const { createTextCompletion } = useTextCompletion(question)
  const { createTextCompletion: createAzureTextCompletion } =
    useAzureTextCompletion(question)
  const { createImage } = useImage(question)
  const { createImage: createAzureImage } = useAzureImageGeneration(question)
  const { createTranscription, createTranslation } = useAudio(
    question,
    hashFile
  )

  const requests = {
    [Products.OpenAIChat]: createChatCompletion,
    [Products.OpenAICompletion]: createTextCompletion,
    [Products.OpenAIAudioTranscription]: createTranscription,
    [Products.OpenAIAudioTranslation]: createTranslation,
    [Products.OpenAIImageGeneration]: createImage,
    [Products.AzureChat]: createAzureChatCompletion,
    [Products.AzureCompletion]: createAzureTextCompletion,
    [Products.AzureImageGeneration]: createAzureImage,
    [Products.ClaudeChat]: createChatCompletion
  }

  return requests
}

export default useModelApis