import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
  LanguageIcon as LanguageIconOutline,
  MicrophoneIcon as MicrophoneIconOutline,
  PhotoIcon as PhotoIconOutline,
  ShieldCheckIcon as ShieldCheckIconOutline
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  LanguageIcon as LanguageIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
  PhotoIcon as PhotoIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid'
import { conversationTitles } from 'src/shared/constants'
import { Products } from 'src/types/global'
import { OutlineTranslationIcon,
  SolidTranslationIcon}from 'src/components/Icons'

export const iconClassName = 'h-6 w-6 text-black dark:text-white'

export default [
  {
    product: Products.ChatCompletion,
    tooltip: conversationTitles[Products.ChatCompletion],
    inactive: <ChatBubbleLeftRightIconOutline className={iconClassName} />,
    active: <ChatBubbleLeftRightIconSolid className={iconClassName} />
  },
  {
    product: Products.TextCompletion,
    tooltip: conversationTitles[Products.TextCompletion],
    inactive: (
      <ChatBubbleBottomCenterTextIconOutline className={iconClassName} />
    ),
    active: <ChatBubbleBottomCenterTextIconSolid className={iconClassName} />
  },
  {
    product: Products.AudioTranscription,
    tooltip: conversationTitles[Products.AudioTranscription],
    inactive: <MicrophoneIconOutline className={iconClassName} />,
    active: <MicrophoneIconSolid className={iconClassName} />
  },
  {
    product: Products.AudioTranslation,
    tooltip: conversationTitles[Products.AudioTranslation],
    inactive: <OutlineTranslationIcon className={iconClassName} />,
    active: <SolidTranslationIcon className={iconClassName} />
  },
  {
    product: Products.Image,
    tooltip: conversationTitles[Products.Image],
    inactive: <PhotoIconOutline className={iconClassName} />,
    active: <PhotoIconSolid className={iconClassName} />
  },
  {
    product: Products.Moderation,
    tooltip: conversationTitles[Products.Moderation],
    inactive: <ShieldCheckIconOutline className={iconClassName} />,
    active: <ShieldCheckIconSolid className={iconClassName} />
  }
]
