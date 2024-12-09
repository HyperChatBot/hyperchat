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
import { Companies, Functions, Products } from 'src/types/global'

export const iconClassName = 'h-6 w-6 text-black dark:text-white'
export const companyClassName = 'h-8 w-8'

export default [
  {
    product: Products.ChatCompletion,
    inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
    active: <ChatBubbleLeftRightIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI],
    functions: [
      Functions.SpeechToText,
      Functions.TextToSpeech,
      Functions.ImageAttachment
    ]
  },
  {
    product: Products.Completion,
    inactive: (
      <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
    ),
    active: <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI],
    functions: [Functions.SpeechToText, Functions.TextToSpeech]
  },
  {
    product: Products.AudioTranscription,
    inactive: <MicrophoneIconOutline className={iconClassName} />,
    active: <MicrophoneIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI],
    functions: [
      Functions.SpeechToText,
      Functions.TextToSpeech,
      Functions.AudioAttachment
    ]
  },
  {
    product: Products.AudioTranslation,
    inactive: <OutlineTranslationIcon className={iconClassName} />,
    active: <SolidTranslationIcon className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI],
    functions: [
      Functions.SpeechToText,
      Functions.TextToSpeech,
      Functions.AudioAttachment
    ]
  },
  {
    product: Products.ImageGeneration,
    inactive: <PhotoIconOutline className={iconClassName} />,
    active: <PhotoIconSolid className={iconClassName} />,
    realm: [Companies.Azure, Companies.OpenAI],
    functions: [Functions.SpeechToText]
  }
]
