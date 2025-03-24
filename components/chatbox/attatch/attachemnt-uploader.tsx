import { cn, convertToBase64 } from '@/lib/utils'
import { base64FilePromptAtom } from '@/stores/conversation'
import { useAtom } from 'jotai'
import { Paperclip } from 'lucide-react'
import { ChangeEvent, FC, useRef } from 'react'

interface Props {
  className?: string
}

const AttachmentUploader: FC<Props> = ({ className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [base64FilePrompt, setBase64FilePrompt] = useAtom(base64FilePromptAtom)

  const validate = () => true

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    try {
      const promises = []
      for (const file of files) {
        promises.push(convertToBase64(file))
      }

      const base64Files = await Promise.all(promises)
      setBase64FilePrompt([...base64FilePrompt, ...base64Files])
    } catch {
      // TODO:
    } finally {
      fileInputRef.current.files = null
    }
  }

  return (
    <section className={className}>
      <label
        htmlFor="$$file-input"
        className="relative flex cursor-pointer items-center"
      >
        <input
          type="file"
          id="$$file-input"
          className="absolute h-6 w-6 opacity-0 file:h-6 file:w-6"
          multiple
          ref={fileInputRef}
          onChange={onFileChange}
        />

        <Paperclip
          className={cn(
            'relative h-5 w-5',
            {
              'text-opacity-30 text-black dark:text-white': !validate()
            },
            {
              '': validate()
            }
          )}
        />
      </label>
    </section>
  )
}

export default AttachmentUploader
