import classNames from 'classnames'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAudio,
  useChatCompletionStream,
  useEnterKey,
  useImage,
  useModeration,
  useTextCompletion
} from 'src/hooks'
import { currPruductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

interface Props {
  showScrollToBottomBtn: () => void
}

const InputBox: FC<Props> = ({ showScrollToBottomBtn }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currProduct = useRecoilValue(currPruductState)
  const [question, setQuestion] = useState('')
  const [currFile, setCurrFile] = useState<File | null>(null)

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      setCurrFile(file)
    }
  }

  const { createChatCompletion } = useChatCompletionStream(
    question,
    setQuestion,
    showScrollToBottomBtn
  )

  const { createTextCompletion } = useTextCompletion(
    question,
    setQuestion,
    showScrollToBottomBtn
  )

  const { createModeration } = useModeration(
    question,
    setQuestion,
    showScrollToBottomBtn
  )

  const { createImage } = useImage(question, setQuestion, showScrollToBottomBtn)

  const { createTranscription } = useAudio(
    question,
    setQuestion,
    currFile,
    showScrollToBottomBtn
  )

  const requests = {
    [Products.ChatCompletion]: createChatCompletion,
    [Products.TextCompletion]: createTextCompletion,
    [Products.Audio]: createTranscription,
    [Products.Moderation]: createModeration,
    [Products.Image]: createImage
  }

  useEnterKey(() => requests[currProduct]())

  return (
    <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-gray-800">
      {currProduct === Products.Audio && (
        <label htmlFor="$$video-input" className="relative">
          <input
            type="file"
            id="$$video-input"
            accept="audio/mp3,video/mp4,video/mpeg,video/mpea,video/m4a,video/wav,video/webm"
            className="absolute h-6 w-6 opacity-0"
            ref={fileInputRef}
            onChange={onFileChange}
          />
          <LinearPaperclipIcon className="mr-6" />
        </label>
      )}
      <section className="relative flex w-full">
        <input
          value={question}
          type="text"
          className="flex-1 rounded-xl border-2 pb-3.5 pl-5 pr-5 pt-3.5 text-sm text-black placeholder:text-black placeholder:text-opacity-50 dark:text-white dark:placeholder:text-white dark:placeholder:text-opacity-50"
          placeholder="Type a message"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div onClick={requests[currProduct]}>
          <BoldSendIcon
            className="absolute right-5 top-3.5"
            pathClassName={classNames(
              'text-black dark:text-white fill-current',
              {
                'text-opacity-30': question.trim().length === 0,
                'text-main-purple dark:text-main-purple':
                  question.trim().length > 0
              }
            )}
          />
        </div>
      </section>
    </section>
  )
}

export default InputBox
