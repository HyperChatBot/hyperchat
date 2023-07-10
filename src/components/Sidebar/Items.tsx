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
  OutlineTranslationIcon,
  SolidTranslationIcon
} from 'src/components/Icons'
import { Companies, Products } from 'src/types/global'

export const iconClassName = 'h-6 w-6 text-black dark:text-white'
export const companyClassName = 'h-8 w-8'

export default [
  {
    product: Products.ChatCompletion,
    inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
    active: <ChatBubbleLeftRightIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI]
  },
  {
    product: Products.TextCompletion,
    inactive: (
      <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
    ),
    active: <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI]
  },
  {
    product: Products.AudioTranscription,
    inactive: <MicrophoneIconOutline className={iconClassName} />,
    active: <MicrophoneIconSolid className={iconClassName} />,
    realm: [, Companies.OpenAI]
  },
  {
    product: Products.AudioTranslation,
    inactive: <OutlineTranslationIcon className={iconClassName} />,
    active: <SolidTranslationIcon className={iconClassName} />,
    realm: [, Companies.OpenAI]
  },
  {
    product: Products.ImageGeneration,
    inactive: <PhotoIconOutline className={iconClassName} />,
    active: <PhotoIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI]
  }
]
