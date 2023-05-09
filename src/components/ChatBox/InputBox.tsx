import Input from '@mui/material/Input'
import classNames from 'classnames'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAppData,
  useAudio,
  useChatCompletionStream,
  useEdit,
  useEnterKey,
  useImage,
  useTextCompletion
} from 'src/hooks'
import { isAudioProduct } from 'src/shared/utils'
import {
  currConversationState,
  loadingState,
  summaryInputVisibleState
} from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { HashFile, Products } from 'src/types/global'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

const InputBox: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currConversation = useRecoilValue(currConversationState)
  const summaryInputVisible = useRecoilValue(summaryInputVisibleState)
  const currProduct = useRecoilValue(currProductState)
  const loading = useRecoilValue(loadingState)
  const { saveFileToAppDataDir } = useAppData()
  const [question, setQuestion] = useState('')
  const [hashFile, setHashFile] = useState<HashFile | null>(null)

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      const hashName = await saveFileToAppDataDir(file)
      setHashFile({
        file,
        hashName
      })
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
    if (loading) return
    if (summaryInputVisible) return
    if (!isAudioProduct(currProduct) && question.trim().length === 0) return

    requests[currProduct]()

    setQuestion('')

    if (textareaRef.current) {
      textareaRef.current.blur()
    }
  }

  useEnterKey(() => handleRequest())

  if (!currConversation) return null

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
            onInput={onFileChange}
          />
          <LinearPaperclipIcon className="mr-6" />
        </label>
      )}
      <section className="relative flex w-full">
        <Input
          inputRef={textareaRef}
          className="max-h-52 overflow-scroll rounded-md border border-black/10 bg-white text-sm shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
          placeholder="Send a message."
          multiline
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disableUnderline
          fullWidth
          sx={{
            paddingTop: 1.5,
            paddingRight: 2,
            paddingBottom: 1.5,
            paddingLeft: 2
          }}
        />

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
