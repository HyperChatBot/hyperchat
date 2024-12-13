import {
  DocumentDuplicateIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { DateTime } from 'luxon'
import { ChatCompletionContentPartText } from 'openai/resources'
import { FC, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useTTS } from 'src/hooks'
import { metaOfCurrProductSelector } from 'src/stores/global'
import { Message, Roles } from 'src/types/conversation'
import { Functions } from 'src/types/global'

interface Props {
  message: Message
}

const ToolsBox: FC<Props> = ({ message: { createdAt, content, role } }) => {
  const [audioUrl, setAudioUrl] = useState('')
  const metaOfCurrProduct = useRecoilValue(metaOfCurrProductSelector)
  const createSpeech = useTTS()
  const canUseTTS = metaOfCurrProduct.functions?.includes(
    Functions.TextToSpeech
  )
  const text = (content as ChatCompletionContentPartText[])?.[0]?.text

  const createTTSUrl = async () => {
    if (typeof createSpeech === 'function') {
      const url = await createSpeech(text)
      if (url) {
        setAudioUrl(url)
      }
    }
  }

  return (
    <section
      className={
        'mt-2 flex items-center gap-2 text-xs text-black text-opacity-30 opacity-0 transition duration-250 ease-in-out group-hover:opacity-100 group-hover:duration-250 dark:text-dark-bubble-assistant-text dark:text-opacity-30'
      }
    >
      {role === Roles.Assistant && (
        <>
          {canUseTTS && (
            <SpeakerWaveIcon
              className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white"
              onClick={createTTSUrl}
            />
          )}
          <DocumentDuplicateIcon className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white" />
        </>
      )}

      {DateTime.fromMillis(createdAt).toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}

      {audioUrl && <audio src={audioUrl} className="hidden" autoPlay />}
    </section>
  )
}

export default ToolsBox
