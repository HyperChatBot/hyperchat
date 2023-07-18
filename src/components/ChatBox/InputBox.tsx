import { MicrophoneIcon } from '@heroicons/react/24/solid'
import Tooltip from '@mui/material/Tooltip'
import classNames from 'classnames'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useAppData, useRequest } from 'src/hooks'
import { isAudioProduct } from 'src/shared/utils'
import { currConversationState, loadingState } from 'src/stores/conversation'
import { currProductState } from 'src/stores/global'
import { HashFile } from 'src/types/global'
import Divider from '../Divider'
import { SolidSendIcon } from '../Icons'

const InputBox: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currConversation = useRecoilValue(currConversationState)
  const currProduct = useRecoilValue(currProductState)
  const loading = useRecoilValue(loadingState)
  const { saveFileToAppDataDir } = useAppData()
  const [prompt, setPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hashFile, setHashFile] = useState<HashFile | null>(null)
  const requests = useRequest(prompt, hashFile as HashFile)

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

  const resetInput = () => {
    setPrompt('')
    setHashFile(null)

    if (textareaRef.current) {
      textareaRef.current.blur()
      textareaRef.current.value = ''
    }
  }

  // Prompt is optional in audio products.
  const validate = () => {
    if (loading) return false

    if (isAudioProduct(currProduct)) {
      return Boolean(hashFile)
    } else {
      return prompt.trim().length !== 0
    }
  }

  const handleRequest = () => {
    if (!validate()) return

    requests[currProduct]()
    resetInput()
  }

  // FIXME: I cannot declare the type of `event` correctly.
  // @ts-ignore
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()

      const start = event.target.selectionStart
      const end = event.target.selectionEnd
      const value = event.target.value

      setPrompt(value.substring(0, start) + '\n' + value.substring(end))
      event.target.selectionStart = event.target.selectionEnd = start + 1
    }

    if (event.key === 'Enter' && !event.shiftKey && !isTyping) {
      event.preventDefault()
      handleRequest()
    }
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`
    }
  }, [prompt])

  if (!currConversation) return null

  return (
    <section className="absolute bottom-6 left-6 w-[calc(100%_-_3rem)] bg-white pt-6 dark:bg-gray-800">
      <section className="relative flex w-full">
        <textarea
          ref={textareaRef}
          className={classNames(
            'w-full resize-none rounded-md border border-black/10 bg-white px-4 py-3 pr-10 text-sm text-black  outline-none dark:border-gray-900/50 dark:bg-gray-700 dark:text-white',
            { 'pr-24': isAudioProduct(currProduct) }
          )}
          style={{
            resize: 'none',
            bottom: `${textareaRef?.current?.scrollHeight}px`,
            maxHeight: '400px',
            overflow: `${
              textareaRef.current && textareaRef.current.scrollHeight > 400
                ? 'auto'
                : 'hidden'
            }`
          }}
          placeholder="Type a message..."
          value={prompt}
          rows={1}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <section className="absolute bottom-2.5 right-4 z-10 flex gap-3">
          {isAudioProduct(currProduct) && (
            <>
              <label
                htmlFor="$$video-input"
                className="relative flex cursor-pointer items-center"
              >
                <input
                  type="file"
                  id="$$video-input"
                  accept="audio/mp3,video/mp4,video/mpeg,video/mpea,video/m4a,video/wav,video/webm"
                  className="absolute h-6 w-6 opacity-0 file:h-6 file:w-6"
                  ref={fileInputRef}
                  onChange={onFileChange}
                />
                <Tooltip
                  title={hashFile?.file.name || ''}
                  placement="top"
                  open={Boolean(hashFile?.file.name)}
                >
                  <MicrophoneIcon
                    className={classNames(
                      'relative h-5 w-5',
                      {
                        'text-black text-opacity-30 dark:text-white':
                          !validate()
                      },
                      {
                        'text-main-purple text-opacity-100 dark:text-main-purple':
                          validate()
                      }
                    )}
                  />
                </Tooltip>
              </label>
              <Divider direction="vertical" className="h-6" />
            </>
          )}

          <SolidSendIcon
            onClick={handleRequest}
            pathClassName={classNames(
              'fill-current',
              {
                'text-black dark:text-white text-opacity-30': !validate()
              },
              {
                'text-main-purple dark:text-main-purple text-opacity-100':
                  validate()
              }
            )}
          />
        </section>
      </section>
    </section>
  )
}

export default InputBox
