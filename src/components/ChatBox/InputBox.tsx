import classNames from 'classnames'
import { FC, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useChatCompletionStream,
  useEnterKey,
  useTextCompletion,
  useEmbedding
} from 'src/hooks'
import { currPruductState } from 'src/stores/global'
import { Products } from 'src/types/global'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

interface Props {
  showScrollToBottomBtn: () => void
}

const InputBox: FC<Props> = ({ showScrollToBottomBtn }) => {
  const currProduct = useRecoilValue(currPruductState)
  const [question, setQuestion] = useState('')

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

  const { createEmbedding } = useEmbedding(
    question,
    setQuestion,
    showScrollToBottomBtn
  )


  const requests = {
    [Products.ChatCompletion]: createChatCompletion,
    [Products.TextCompletion]: createTextCompletion,
    [Products.Audio]: createTextCompletion,
    [Products.Moderation]: createTextCompletion,
    [Products.Image]: createTextCompletion,
    [Products.Embedding]: createEmbedding
  }

  useEnterKey(() => requests[currProduct]())

  return (
    <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-gray-800">
      <LinearPaperclipIcon className="mr-6" />
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
