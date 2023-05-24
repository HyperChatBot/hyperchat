import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
  MicrophoneIcon as MicrophoneIconOutline,
  PhotoIcon as PhotoIconOutline
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
  PhotoIcon as PhotoIconSolid
} from '@heroicons/react/24/solid'
import {
  AnthropicLogoIcon,
  AzureLogoIcon,
  ChatGPTLogoIcon,
  OutlineTranslationIcon,
  SolidTranslationIcon
} from 'src/components/Icons'
import { snakeCaseToTitleCase } from 'src/shared/utils'
import { Companies, Products } from 'src/types/global'

export const iconClassName = 'h-6 w-6 text-black dark:text-white'
export const companyClassName = 'h-8 w-8'

export default [
  {
    company: Companies.OpenAI,
    companyLogo: <ChatGPTLogoIcon className={companyClassName} />,
    products: [
      {
        product: Products.OpenAIChat,
        tooltip: snakeCaseToTitleCase(Products.OpenAIChat),
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      },
      {
        product: Products.OpenAICompletion,
        tooltip: snakeCaseToTitleCase(Products.OpenAICompletion),
        inactive: (
          <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
        ),
        active: (
          <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
        )
      },
      {
        product: Products.OpenAIAudioTranscription,
        tooltip: snakeCaseToTitleCase(Products.OpenAIAudioTranscription),
        inactive: <MicrophoneIconOutline className={iconClassName} />,
        active: <MicrophoneIconSolid className={iconClassName} />
      },
      {
        product: Products.OpenAIAudioTranslation,
        tooltip: snakeCaseToTitleCase(Products.OpenAIAudioTranslation),
        inactive: <OutlineTranslationIcon className={iconClassName} />,
        active: <SolidTranslationIcon className={iconClassName} />
      },
      {
        product: Products.OpenAIImageGeneration,
        tooltip: snakeCaseToTitleCase(Products.OpenAIImageGeneration),
        inactive: <PhotoIconOutline className={iconClassName} />,
        active: <PhotoIconSolid className={iconClassName} />
      }
    ]
  },
  {
    company: Companies.Azure,
    companyLogo: <AzureLogoIcon className={companyClassName} />,
    products: [
      {
        product: Products.AzureChat,
        tooltip: snakeCaseToTitleCase(Products.AzureChat),
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      },
      {
        product: Products.AzureCompletion,
        tooltip: snakeCaseToTitleCase(Products.AzureCompletion),
        inactive: (
          <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
        ),
        active: (
          <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
        )
      },
      {
        product: Products.AzureImageGeneration,
        tooltip: snakeCaseToTitleCase(Products.AzureImageGeneration),
        inasctive: <PhotoIconOutline className={iconClassName} />,
        active: <PhotoIconSolid className={iconClassName} />
      }
    ]
  },
  {
    company: Companies.Anthropic,
    companyLogo: <AnthropicLogoIcon className={companyClassName} />,
    products: [
      {
        product: Products.ClaudeChat,
        tooltip: snakeCaseToTitleCase(Products.ClaudeChat),
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      }
    ]
  }
]
