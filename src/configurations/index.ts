import {
  AudioTranscriptionConfiguration,
  AudioTranslationConfiguration,
  ChatCompletionConfiguration,
  CompletionConfiguration,
  ImageGenerationConfiguration
} from 'src/components/Configuration'
import { Products } from 'src/types/global'
import { configuration as audioTranscriptionConfiguration } from './audioTranscription'
import { configuration as audioTranslationConfiguration } from './audioTranslation'
import { configuration as chatCompletionConfiguration } from './chatCompletion'
import { configuration as completionConfiguration } from './completion'
import { configuration as imageGenerationConfiguration } from './imageGeneration'

export const configurations = {
  [Products.ChatCompletion]: {
    component: () => ChatCompletionConfiguration,
    default: chatCompletionConfiguration
  },
  [Products.ImageGeneration]: {
    component: () => ImageGenerationConfiguration,
    default: imageGenerationConfiguration
  },
  [Products.Completion]: {
    component: () => CompletionConfiguration,
    default: completionConfiguration
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
