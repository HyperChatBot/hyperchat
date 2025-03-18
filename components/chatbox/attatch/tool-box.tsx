import { useTTS } from '@/hooks'
import { ContentPartType, Message, Roles } from '@/types/conversation'
import { Copy, Speaker } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  message: Message
}

const ToolsBox: FC<Props> = ({ message: { createdAt, content, role } }) => {
  const [audioUrl, setAudioUrl] = useState('')
  const createSpeech = useTTS()

  const createTTSUrl = async () => {
    if (typeof createSpeech === 'function') {
      const textPrompt = content.find(
        (item) => item.type === ContentPartType.TextPrompt
      )

      if (textPrompt) {
        const url = await createSpeech(textPrompt.text)
        if (url) {
          setAudioUrl(url)
        }
      }
    }
  }

  return (
    <section className={'mt-2 flex items-center gap-2 text-xs'}>
      {role === Roles.Assistant && (
        <>
          <Speaker
            className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white"
            onClick={createTTSUrl}
          />
          <Copy className="h-4 w-4 cursor-pointer text-black opacity-30 dark:text-white" />
        </>
      )}

      {audioUrl && <audio src={audioUrl} className="hidden" autoPlay />}
    </section>
  )
}

export default ToolsBox
