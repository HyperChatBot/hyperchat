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
import { TEXTAREA_MAX_ROWS } from 'src/shared/constants'
import { currPruductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

interface Props {
  showScrollToBottomBtn: () => void
}

const InputBox: FC<Props> = ({ showScrollToBottomBtn }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currProduct = useRecoilValue(currPruductState)
  const [rows, setRows] = useState(1)
  const [question, setQuestion] = useState('')
  const [currFile, setCurrFile] = useState<File | null>(null)

  const clearTextarea = () => {
    setRows(1)
    setQuestion('')
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      setCurrFile(file)
    }
  }

  const { createChatCompletion } = useChatCompletionStream(
    question,
    clearTextarea,
    showScrollToBottomBtn
  )

  const { createTextCompletion } = useTextCompletion(
    question,
    clearTextarea,
    showScrollToBottomBtn
  )

  const { createModeration } = useModeration(
    question,
    clearTextarea,
    showScrollToBottomBtn
  )

  const { createImage } = useImage(
    question,
    clearTextarea,
    showScrollToBottomBtn
  )

  const { createTranscription } = useAudio(
    question,
    clearTextarea,
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

  const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)

    const currRow = Math.floor(e.target.scrollHeight / e.target.clientHeight)
    setRows(currRow > TEXTAREA_MAX_ROWS ? TEXTAREA_MAX_ROWS : currRow)
  }

  return (
    <section className="items-centerbg-white absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] pt-6 dark:bg-gray-800">
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
        <textarea
          tabIndex={0}
          rows={rows}
          value={question}
          className="z-10 flex-1 resize-none rounded-xl border-2 pb-3.5 pl-5 pr-14 pt-3.5 text-sm text-black placeholder:text-black placeholder:text-opacity-50 dark:text-white dark:placeholder:text-white dark:placeholder:text-opacity-50"
          placeholder="Send a message."
          onChange={onTextareaChange}
        />
        <BoldSendIcon
          onClick={requests[currProduct]}
          className="absolute bottom-3.5 right-5 z-10"
          pathClassName={classNames('text-black dark:text-white fill-current', {
            'text-opacity-30': question.trim().length === 0,
            'text-main-purple dark:text-main-purple': question.trim().length > 0
          })}
        />
      </section>
    </section>
  )
}

export default InputBox
