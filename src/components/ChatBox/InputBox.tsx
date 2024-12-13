import classNames from 'classnames'
import { produce } from 'immer'
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText
} from 'openai/resources'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  useAudio,
  useChatCompletion,
  useCompletion,
  useImageGeneration
} from 'src/hooks'
import {
  audioFileState,
  base64ImagesState,
  currConversationState,
  loadingState,
  userInputState
} from 'src/stores/conversation'
import { currProductState, metaOfCurrProductSelector } from 'src/stores/global'
import { settingsState } from 'src/stores/settings'
import { AudioContentPart } from 'src/types/conversation'
import { Functions, Products } from 'src/types/global'
import { LoadingIcon, SolidCloseIcon, SolidSendIcon } from '../Icons'
import WaveForm from '../Waveform'
import AttachmentUploader from './AttachmentUploader'
import AudioRecorder from './Recorder'

const InputBox: FC = () => {
  const currConversation = useRecoilValue(currConversationState)
  const currProduct = useRecoilValue(currProductState)
  const settings = useRecoilValue(settingsState)
  const loading = useRecoilValue(loadingState)
  const metaOfCurrProduct = useRecoilValue(metaOfCurrProductSelector)
  const [userInput, setUserInput] = useRecoilState(userInputState)
  const [audioFile, setAudioFile] = useRecoilState(audioFileState)
  const [base64Images, setBase64Images] = useRecoilState(base64ImagesState)
  const createChatCompletion = useChatCompletion()
  const createAudio = useAudio()
  const createImage = useImageGeneration()
  const createCompletion = useCompletion()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const canAddAttachment =
    metaOfCurrProduct.functions.includes(Functions.ImageAttachment) ||
    metaOfCurrProduct.functions.includes(Functions.AudioAttachment)
  const canUseSTT = metaOfCurrProduct.functions.includes(Functions.SpeechToText)

  const deleteBase64Image = (idx: number) => {
    setBase64Images(
      produce(base64Images, (draft) => {
        draft?.splice(idx, 1)
      })
    )
  }

  const resetInput = () => {
    setUserInput('')
    setAudioFile({
      filename: '',
      binary: undefined
    })
    setBase64Images(null)
  }

  const validate = () => {
    if (loading) return false
    return userInput.trim().length !== 0
  }

  const handleRequest = () => {
    if (!settings || !validate()) return

    if (currProduct === Products.ChatCompletion) {
      const chatMessageImageContent:
        | ChatCompletionContentPartImage[]
        | undefined = base64Images?.map((imageUrl) => ({
        type: 'image_url',
        image_url: {
          url: imageUrl
        }
      }))

      const chatMessageTextContent: ChatCompletionContentPartText = {
        type: 'text',
        text: userInput
      }

      const chatCompletionUserMessage: ChatCompletionContentPart[] = [
        ...(chatMessageImageContent || []),
        chatMessageTextContent
      ]

      if (createChatCompletion) {
        createChatCompletion(chatCompletionUserMessage)
      }
    }

    if (
      currProduct === Products.AudioTranscription ||
      currProduct === Products.AudioTranslation
    ) {
      const audioContentPart: AudioContentPart[] = [
        {
          type: 'audio',
          audioUrl: { url: audioFile.filename },
          text: userInput,
          binary: audioFile.binary
        }
      ]

      if (createAudio) {
        if (currProduct === Products.AudioTranscription) {
          const createAudioTranscription =
            createAudio[Products.AudioTranscription]
          createAudioTranscription(audioContentPart)
        }

        if (currProduct === Products.AudioTranslation) {
          const createAudioTranslation = createAudio[Products.AudioTranslation]
          createAudioTranslation(audioContentPart)
        }
      }
    }

    if (currProduct === Products.ImageGeneration) {
      const imageGenerationTextContent: ChatCompletionContentPartText[] = [
        {
          type: 'text',
          text: userInput
        }
      ]

      if (createImage) {
        createImage(imageGenerationTextContent)
      }
    }

    if (currProduct === Products.Completion) {
      const completionTextContent: ChatCompletionContentPartText[] = [
        {
          type: 'text',
          text: userInput
        }
      ]

      if (createCompletion) {
        createCompletion(completionTextContent)
      }
    }

    resetInput()
  }

  // FIXME: I cannot declare the type of `event` correctly.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()

      const start = event.target.selectionStart
      const end = event.target.selectionEnd
      const value = event.target.value

      setUserInput(value.substring(0, start) + '\n' + value.substring(end))
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
  }, [userInput])

  if (!currConversation) return null

  return (
    <section className="absolute bottom-6 left-6 w-[calc(100%_-_3rem)] rounded-md border border-black/10 bg-white dark:bg-gray-700">
      {Array.isArray(base64Images) && base64Images.length > 0 && (
        <section className="mb-2 ml-4 mt-4 flex w-full flex-row gap-2">
          {base64Images.map((image, idx) => (
            <section className="group relative" key={idx}>
              <span className="absolute -right-2 -top-2 hidden rounded-full bg-white group-hover:block">
                <SolidCloseIcon
                  className="h-6 w-6 text-black"
                  onClick={() => deleteBase64Image(idx)}
                />
              </span>
              <img src={image} className="h-16 w-16 rounded-xl object-cover" />
            </section>
          ))}
        </section>
      )}
      {audioFile.filename && (
        <section className="ml-4 mt-4 flex w-1/2 rounded-3xl bg-main-purple">
          <WaveForm filename={audioFile.filename} />
        </section>
      )}

      {canAddAttachment && (
        <AttachmentUploader className="absolute bottom-3 left-4" />
      )}

      <textarea
        ref={textareaRef}
        className={classNames(
          'block w-full resize-none rounded-md bg-white px-4 py-3 pl-12 pr-20 text-sm text-black outline-none dark:border-gray-900/50 dark:bg-gray-700 dark:text-white',
          { ['pl-4']: !canAddAttachment }
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
        value={userInput}
        rows={1}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <section className="absolute bottom-[2px] right-4 flex items-center">
        {canUseSTT && <AudioRecorder />}

        {loading ? (
          <LoadingIcon className="h-5 w-5 animate-spin text-main-purple" />
        ) : (
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
        )}
      </section>
    </section>
  )
}

export default memo(InputBox)
