import { base64FilePromptAtom } from '@/stores/conversation'
import { useAtom } from 'jotai'
import { ShieldClose } from 'lucide-react'
import { FC } from 'react'

interface Props {
  className?: string
}

const AttachmentPreview: FC<Props> = ({ className }) => {
  const [base64FilePrompt, setBase64FilePrompt] = useAtom(base64FilePromptAtom)

  const deleteBase64FilePrompt = (id: string) => {
    setBase64FilePrompt(base64FilePrompt.filter((prompt) => prompt.id !== id))
  }

  return (
    <section className={className}>
      {base64FilePrompt.map((prompt) => {
        if (prompt.mimeType.includes('image')) {
          return (
            <section
              className="mt-4 mb-2 ml-4 flex w-full flex-row gap-2"
              key={prompt.id}
            >
              <section className="group relative">
                <span className="absolute -top-2 -right-2 hidden rounded-full bg-white group-hover:block">
                  <ShieldClose
                    onClick={() => deleteBase64FilePrompt(prompt.id)}
                  />
                </span>
                <img
                  src={prompt.data}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              </section>
            </section>
          )
        }

        if (prompt.mimeType.includes('audio')) {
          return (
            <section
              className="mt-4 ml-4 flex w-1/2 rounded-3xl"
              key={prompt.id}
            >
              <audio src={prompt.data} controls />
            </section>
          )
        }

        if (prompt.mimeType.includes('video')) {
          return (
            <section
              className="mt-4 ml-4 flex w-1/2 rounded-3xl"
              key={prompt.id}
            >
              <video src={prompt.data} controls />
            </section>
          )
        }

        return (
          <section className="mt-4 ml-4 flex w-1/2 rounded-3xl" key={prompt.id}>
            {prompt.name}
          </section>
        )
      })}
    </section>
  )
}

export default AttachmentPreview
