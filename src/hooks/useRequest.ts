import {
  useAudio,
  useChatCompletion,
  useCompletion,
  useImageGeneration
} from 'src/hooks'
import { HashFile, Products } from 'src/types/global'

const useRequest = (prompt: string, hashFile: HashFile) => {
  const chatCompletion = useChatCompletion(prompt)
  const completion = useCompletion(prompt)
  const imageGeneration = useImageGeneration(prompt)
  const audio = useAudio(prompt, hashFile)

  const requests = {
    [Products.ChatCompletion]: chatCompletion,
    [Products.Completion]: completion,
    [Products.ImageGeneration]: imageGeneration,
    [Products.AudioTranscription]: audio?.audioTranscription,
    [Products.AudioTranslation]: audio?.audioTranslation
  }

  return requests
}

export default useRequest
