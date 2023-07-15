import {
  AudioTranscriptionConfiguration,
  AudioTranslationConfiguration,
  ChatCompletionConfiguration,
  ImageGenerationConfiguration,
  TextCompletionConfiguration
} from 'src/components/Configuration'
import { Products } from 'src/types/global'
import { configuration as audioTranscriptionConfiguration } from './audioTranscription'
import { configuration as audioTranslationConfiguration } from './audioTranslation'
import { configuration as chatCompletionConfiguration } from './chatCompletion'
import { configuration as imageGenerationConfiguration } from './imageGeneration'
import { configuration as textCompletionConfiguration } from './textCompletion'

export const configurations = {
  [Products.ChatCompletion]: {
    component: () => ChatCompletionConfiguration,
    default: chatCompletionConfiguration
  },
  [Products.ImageGeneration]: {
    component: () => ImageGenerationConfiguration,
    default: imageGenerationConfiguration
  },
  [Products.TextCompletion]: {
    component: () => TextCompletionConfiguration,
    default: textCompletionConfiguration
  },
  [Products.AudioTranscription]: {
    component: () => AudioTranscriptionConfiguration,
    default: audioTranscriptionConfiguration
  },
  [Products.AudioTranslation]: {
    component: () => AudioTranslationConfiguration,
    default: audioTranslationConfiguration
  }
}
