import classNames from 'classnames'
import { produce } from 'immer'
import { FC, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useEnterKey, useModifyDocument } from 'src/hooks'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import { chatsState, currChatIdState, currChatState } from 'src/stores/chat'
import { Chat, OpenAIChatResponse } from 'src/types/chat'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

interface Props {
  showScrollToBottomBtn: () => void
}

const InputBox: FC<Props> = ({ showScrollToBottomBtn }) => {
  const [question, setQuestion] = useState('')
  const currChatId = useRecoilValue(currChatIdState)
  const [currChat, setCurrChat] = useRecoilState(currChatState)
  const [isStreaming, setIsStreaming] = useState(false)
  const [chats, setChats] = useRecoilState(chatsState)
  const { modifyDocument } = useModifyDocument('chat')
  useEnterKey(() => createChatCompletion())

  const createChatCompletion = async () => {
    if (isStreaming) return
    if (question.trim().length === 0) return

    setIsStreaming(true)

    // Append an empty message object to show loading spin.
    setCurrChat((prevState) => {
      const currState = produce(prevState, (draft) => {
        if (draft) {
          draft.messages.push({
            message_id: EMPTY_MESSAGE_ID,
            answer: '',
            question,
            question_created_at: +new Date(),
            answer_created_at: +new Date()
          })
        }
      })

      return currState
    })

    setQuestion('')

    const completion = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: question
            }
          ],
          model: 'gpt-3.5-turbo',
          stream: true,
          user: currChatId
        })
      }
    )

    const reader = completion.body?.getReader()

    if (completion.status !== 200 || !reader) {
      return 'error'
    }

    let _currChat: Chat | undefined = undefined

    const decoder = new TextDecoder('utf-8')
    try {
      const read = async (): Promise<any> => {
        const { done, value } = await reader.read()

        if (done) {
          setIsStreaming(false)

          showScrollToBottomBtn()

          if (_currChat) {
            modifyDocument(
              {
                // @ts-ignore
                chat_id: currChatId
              },
              {
                messages: _currChat.messages
              }
            )
          }

          return reader.releaseLock()
        }

        const chunk = decoder.decode(value, { stream: true })
        const jsons: OpenAIChatResponse[] = chunk
          .split('data:')
          .map((data) => {
            const trimData = data.trim()
            if (trimData === '') return undefined
            if (trimData === '[DONE]') return undefined
            return JSON.parse(data.trim())
          })
          .filter((data) => data)

        jsons.forEach((json) => {
          const token = json.choices[0].delta.content

          if (token !== undefined) {
            setCurrChat((prevState) => {
              const currState = produce(prevState, (draft) => {
                if (draft) {
                  const messages = draft.messages
                  const last = messages[messages.length - 1]
                  const isFirstChuck = last.message_id === EMPTY_MESSAGE_ID

                  if (isFirstChuck) {
                    last.message_id = json.id
                  }

                  last.answer += token
                  last.answer_created_at = +new Date()
                }
              })

              _currChat = currState
              return currState
            })
          }
        })

        return read()
      }

      await read()
    } catch (e) {
      console.error(e)
    }

    reader.releaseLock()
  }

  return (
    <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-dark-main-bg">
      <LinearPaperclipIcon className="mr-6" />
      <section className="relative flex w-full">
        <input
          value={question}
          type="text"
          className="flex-1 rounded-xl border-2 border-main-gray pb-3.5 pl-5 pr-5 pt-3.5 text-sm text-black text-opacity-40 outline-none dark:border-dark-search-input-border dark:bg-dark-search-input dark:text-dark-text-sub"
          placeholder="Type a message"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div onClick={createChatCompletion}>
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
