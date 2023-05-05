import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
  MicrophoneIcon as MicrophoneIconOutline,
  PencilIcon as PencilIconOutline,
  PhotoIcon as PhotoIconOutline
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  MicrophoneIcon as MicrophoneIconSolid,
  PencilIcon as PencilIconSolid,
  PhotoIcon as PhotoIconSolid
} from '@heroicons/react/24/solid'
import {
  OutlineTranslationIcon,
  SolidTranslationIcon
} from 'src/components/Icons'
import { conversationTitles } from 'src/shared/constants'
import { Products } from 'src/types/global'

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
    product: Products.Edit,
    tooltip: conversationTitles[Products.Edit],
    inactive: <PencilIconOutline className={iconClassName} />,
    active: <PencilIconSolid className={iconClassName} />
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
  }
]
