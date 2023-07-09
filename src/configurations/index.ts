import {
  AudioTranscriptionConfiguration,
  AudioTranslationConfiguration,
  ChatConfiguration,
  ImageGenerationConfiguration,
  TextCompletionConfiguration
} from 'src/components/Configuration'
import { Products } from 'src/types/global'
import { configuration as audioTranscriptionConfiguration } from './audioTranscription'
import { configuration as audioTranslationConfiguration } from './audioTranslation'
import { configuration as chatConfiguration } from './chat'
import { configuration as imageGenerationConfiguration } from './imageGeneration'
import { configuration as textCompletionConfiguration } from './textCompletion'

export const configurations = {
  [Products.ChatCompletion]: {
    component: () => ChatConfiguration,
    default: chatConfiguration
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
