import classNames from 'classnames'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAudioTranscription,
  useAudioTranslation,
  useChatCompletionStream,
  useEdit,
  useEnterKey,
  useImage,
  useTextCompletion
} from 'src/hooks'
import { TEXTAREA_MAX_ROWS } from 'src/shared/constants'
import {
  generateHashName,
  isAudioProduct,
  saveFileToAppDataDir
} from 'src/shared/utils'
import { summaryInputVisibleState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { HashFile, Products } from 'src/types/global'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

const InputBox: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const currProduct = useRecoilValue(currProductState)
  const [rows, setRows] = useState(1)
  const [question, setQuestion] = useState('')
  const [hashFile, setHashFile] = useState<HashFile | null>(null)

  const clearTextarea = () => {
    setRows(1)
    setQuestion('')
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      const hashFile = {
        file,
        hashName: generateHashName(file.name)
      }
      setHashFile(hashFile)
      await saveFileToAppDataDir(hashFile)
    }
  }

  const { createChatCompletion } = useChatCompletionStream(question)
  const { createTextCompletion } = useTextCompletion(question)
  const { createImage } = useImage(question)
  const { createTranscription } = useAudioTranscription(question, hashFile)
  const { createTranslation } = useAudioTranslation(question, hashFile)
  const { createEdit } = useEdit(question)

  const requests = {
    [Products.ChatCompletion]: createChatCompletion,
    [Products.TextCompletion]: createTextCompletion,
    [Products.AudioTranscription]: createTranscription,
    [Products.AudioTranslation]: createTranslation,
    [Products.Image]: createImage,
    [Products.Edit]: createEdit
  }

  const handleRequest = () => {
    if (summaryInputVisible) return
    if (!isAudioProduct(currProduct) && question.trim().length === 0) return

    clearTextarea()
    requests[currProduct]()
  }

  useEnterKey(() => handleRequest())

  const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)

    const currRow = Math.floor(e.target.scrollHeight / e.target.clientHeight)
    setRows(currRow > TEXTAREA_MAX_ROWS ? TEXTAREA_MAX_ROWS : currRow)
  }

  return (
    <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-gray-800">
      {isAudioProduct(currProduct) && (
        <label htmlFor="$$video-input" className="relative flex items-center">
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
          className="z-10 flex-1 resize-none rounded-xl border-2 pb-3.5 pl-5 pr-14 pt-3.5 text-sm text-black placeholder:text-black placeholder:text-opacity-50 dark:bg-gray-800 dark:text-white dark:placeholder:text-white dark:placeholder:text-opacity-50"
          placeholder="Send a message."
          onChange={onTextareaChange}
        />
        <BoldSendIcon
          onClick={handleRequest}
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
