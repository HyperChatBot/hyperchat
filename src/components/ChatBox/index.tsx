import classNames from 'classnames'
import { produce } from 'immer'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import { EMPTY_MESSAGE_ID } from 'src/shared/constants'
import ChatBubble from '../ChatBubble'
import ContractHeader from '../ContactHeader'
import Divider from '../Divider'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'
import MessageSpinner from '../MessageSpinner'

interface MessageData {
  id: string
  question: string
  answer: string
}

interface Message extends Omit<MessageData, 'answer'> {
  answers: string[]
}

const ChatBox: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState('')

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })
    }
  }

  const unstable_search = async () => {
    if (question.trim().length === 0) return

    setMessages([
      ...messages,
      {
        id: EMPTY_MESSAGE_ID,
        question: question,
        answers: []
      }
    ])

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
          stream: true
        })
      }
    )

    const reader = completion.body?.getReader()

    if (completion.status !== 200 || !reader) {
      return 'error'
    }

    const decoder = new TextDecoder('utf-8')
    try {
      const read = async (): Promise<any> => {
        const { done, value } = await reader.read()
        if (done) return reader.releaseLock()

        const chunk = decoder.decode(value, { stream: true })

        const jsons = chunk
          .split('data:')
          .map((data) => {
            const trimData = data.trim()
            if (trimData === '') return undefined
            if (trimData === '[DONE]') {
              // TODO: Store to DB
              return undefined
            }
            return JSON.parse(data.trim())
          })
          .filter((data) => data)

        jsons.forEach((json) => {
          const content = json.choices[0].delta.content

          if (content !== undefined) {
            setMessages((prevState) => {
              const currState = produce(prevState, (draft) => {
                const last = draft[draft.length - 1]
                const isFirstChuck = last.id === EMPTY_MESSAGE_ID

                if (isFirstChuck) {
                  last.id = json.id
                  last.answers = [content]
                } else {
                  last.answers.push(content)
                }
              })

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

  const onEnterPress = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Enter') {
      unstable_search()
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onEnterPress)

    return () => {
      document.removeEventListener('keyup', onEnterPress)
    }
  }, [])

  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />

      <section
        className="no-scrollbar relative h-[calc(100vh_-_10.25rem)] overflow-y-scroll p-6"
        ref={chatBoxRef}
      >
        {messages.length > 0 && (
          <>
            {messages.map((message) => (
              <Fragment key={message.id}>
                <ChatBubble role="user" avatar="">
                  {message.question}
                </ChatBubble>
                <ChatBubble role="assistant" avatar={''}>
                  {message.id === EMPTY_MESSAGE_ID ? (
                    <MessageSpinner />
                  ) : (
                    <ReactMarkdown
                      rehypePlugins={[rehypeKatex]}
                      remarkPlugins={[remarkGfm]}
                      className=""
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              // @ts-ignore
                              style={mdCodeTheme}
                              language={match[1] ?? 'js'}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className={classNames('font-semibold', className)}
                              {...props}
                            >
                              `{children}`
                            </code>
                          )
                        },
                        p({ className, children, ...props }) {
                          return (
                            <p
                              className={classNames('mb-2', className)}
                              {...props}
                            >
                              {children}
                            </p>
                          )
                        },
                        pre({ className, children, ...props }) {
                          return (
                            <pre
                              className={classNames(
                                'mb-2 overflow-x-scroll text-sm',
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </pre>
                          )
                        },
                        ol({ className, children, ...props }) {
                          return (
                            <ol
                              className={classNames(
                                'mb-2 list-disc pl-4',
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </ol>
                          )
                        },
                        ul({ className, children, ...props }) {
                          return (
                            <ul
                              className={classNames(
                                'mb-2 list-decimal pl-4',
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </ul>
                          )
                        },
                        li({ className, children, ...props }) {
                          return (
                            <li
                              className={classNames('mb-2', className)}
                              {...props}
                            >
                              {children}
                            </li>
                          )
                        }
                      }}
                    >
                      {message.answers.join('')}
                    </ReactMarkdown>
                  )}
                </ChatBubble>
              </Fragment>
            ))}
          </>
        )}
      </section>

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
          <div onClick={unstable_search}>
            <BoldSendIcon
              className="absolute right-5 top-3.5"
              pathClassName={classNames(
                'text-black text-opacity-30 fill-current transition duration-250 ease-in-out',
                {
                  'text-main-purple dark:text-main-purple text-opacity-100 transition duration-250 ease-in-out':
                    question.trim().length > 0
                }
              )}
            />
          </div>
        </section>
      </section>
    </section>
  )
}

export default ChatBox
