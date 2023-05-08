import classNames from 'classnames'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAudio,
  useChatCompletionStream,
  useEdit,
  useEnterKey,
  useImage,
  useTextCompletion
} from 'src/hooks'
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
  const [question, setQuestion] = useState('')
  const [hashFile, setHashFile] = useState<HashFile | null>(null)

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
  const { createEdit } = useEdit(question)
  const { createTranscription, createTranslation } = useAudio(
    question,
    hashFile
  )

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

    requests[currProduct]()
    setQuestion('')
  }

  useEnterKey(() => handleRequest())

  const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
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
        <div className="relative flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white py-3 pl-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
          <div className='after:content-[" "] invisible relative -left-4 max-h-52 min-h-6 whitespace-pre-wrap pl-4 pr-7'>
            {question}
          </div>
          <textarea
            tabIndex={0}
            rows={1}
            value={question}
            className={
              'absolute bottom-0 left-0 right-0 top-3 m-0 max-h-52 w-full resize-none border-0 bg-transparent p-0 px-4 pr-7 outline-none '
            }
            placeholder="Send a message."
            onChange={onTextareaChange}
          />
        </div>
        <BoldSendIcon
          onClick={handleRequest}
          className="absolute bottom-3.5 right-4 z-10"
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
