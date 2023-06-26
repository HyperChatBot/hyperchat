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
  [Products.OpenAIChat]: {
    component: () => ChatConfiguration,
    default: chatConfiguration
  },
  [Products.OpenAIImageGeneration]: {
    component: () => ImageGenerationConfiguration,
    default: imageGenerationConfiguration
  },
  [Products.AzureChat]: {
    component: () => ChatConfiguration,
    default: chatConfiguration
  },
  [Products.AzureImageGeneration]: {
    component: () => ImageGenerationConfiguration,
    default: imageGenerationConfiguration
  },
  [Products.AzureTextCompletion]: {
    component: () => TextCompletionConfiguration,
    default: textCompletionConfiguration
  },
  [Products.OpenAIAudioTranscription]: {
    component: () => AudioTranscriptionConfiguration,
    default: audioTranscriptionConfiguration
  },
  [Products.OpenAIAudioTranslation]: {
    component: () => AudioTranslationConfiguration,
    default: audioTranslationConfiguration
  },
  [Products.OpenAITextCompletion]: {
    component: () => TextCompletionConfiguration,
    default: textCompletionConfiguration
  }
}
