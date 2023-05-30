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
import classNames from 'classnames'
import AnthropicLogoImg from 'src/assets/anthropic-logo.png'
import {
  AzureLogoIcon,
  ChatGPTLogoIcon,
  OutlineTranslationIcon,
  SolidTranslationIcon
} from 'src/components/Icons'
import { conversationTitles } from 'src/shared/constants'
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
        tooltip: conversationTitles[Products.OpenAIChat],
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      },
      {
        product: Products.OpenAICompletion,
        tooltip: conversationTitles[Products.OpenAICompletion],
        inactive: (
          <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
        ),
        active: (
          <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
        )
      },
      {
        product: Products.OpenAIAudioTranscription,
        tooltip: conversationTitles[Products.OpenAIAudioTranscription],
        inactive: <MicrophoneIconOutline className={iconClassName} />,
        active: <MicrophoneIconSolid className={iconClassName} />
      },
      {
        product: Products.OpenAIAudioTranslation,
        tooltip: conversationTitles[Products.OpenAIAudioTranslation],
        inactive: <OutlineTranslationIcon className={iconClassName} />,
        active: <SolidTranslationIcon className={iconClassName} />
      },
      {
        product: Products.OpenAIImageGeneration,
        tooltip: conversationTitles[Products.OpenAIImageGeneration],
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
        tooltip: conversationTitles[Products.AzureChat],
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      },
      {
        product: Products.AzureCompletion,
        tooltip: conversationTitles[Products.AzureCompletion],
        inactive: (
          <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
        ),
        active: (
          <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
        )
      },
      {
        product: Products.AzureImageGeneration,
        tooltip: conversationTitles[Products.AzureImageGeneration],
        inactive: <PhotoIconOutline className={iconClassName} />,
        active: <PhotoIconSolid className={iconClassName} />
      }
    ]
  },
  {
    company: Companies.Anthropic,
    companyLogo: (
      <img
        src={AnthropicLogoImg}
        alt={Companies.Anthropic}
        className={classNames(companyClassName, 'rounded-md')}
      />
    ),
    products: [
      {
        product: Products.ClaudeChat,
        tooltip: conversationTitles[Products.ClaudeChat],
        inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
        active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
      }
    ]
  }
]
