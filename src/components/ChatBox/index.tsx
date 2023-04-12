import classNames from 'classnames'
import { clone } from 'ramda'
import { FC, useState } from 'react'
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

interface MessageMapper {
  [id: string]: Message
}

const ChatBox: FC = () => {
  const [messages, setMessages] = useState<MessageMapper | null>(null)
  const [question, setQuestion] = useState('')

  const onSearch = () => {
    setMessages({
      ...messages,
      [EMPTY_MESSAGE_ID]: {
        id: '',
        question: question,
        answers: []
      }
    })

    const evtSource = new EventSource(
      'http://127.0.0.1:10086' +
        '/create_chat' +
        `?question=${question}&user_id=${''}`,
      {
        withCredentials: true
      }
    )

    evtSource.addEventListener(
      'open',
      () => {
        console.warn('已开启')
      },
      false
    )

    setQuestion('')

    evtSource.addEventListener(
      'chat/completions',
      (e: MessageEvent<string>) => {
        const { id, question, answer } = JSON.parse(e.data) as MessageData

        setMessages((prevState) => {
          if (prevState) {
            const clonedMsg = clone(prevState)
            const currMsg = clonedMsg[id]

            if (currMsg) {
              currMsg.answers = [...currMsg.answers, answer]
            } else {
              clonedMsg[id] = {
                id,
                question,
                answers: [answer]
              }
            }

            return clonedMsg
          } else {
            return {
              [id]: {
                id,
                question,
                answers: [answer]
              }
            }
          }
        })

        if (evtSource.readyState === 2) {
          evtSource.close()
        }
      },
      false
    )

    evtSource.addEventListener(
      'error',
      (err: Event) => {
        console.error(err)
        evtSource.close()
      },
      false
    )
  }

  return (
    <section className="relative flex-1">
      <ContractHeader />
      <Divider />

      <section className="no-scrollbar relative h-[calc(100vh_-_10rem)] overflow-y-scroll p-6">
        {messages && (
          <>
            {Object.keys(messages).map((id) => (
              <>
                <ChatBubble role="user" avatar="">
                  {messages[id].question}
                </ChatBubble>
                <ChatBubble role="assistant" avatar={''}>
                  {id === EMPTY_MESSAGE_ID ? (
                    <MessageSpinner />
                  ) : (
                    <ReactMarkdown
                      rehypePlugins={[rehypeKatex]}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              // @ts-ignore
                              style={mdCodeTheme}
                              language={match[1]}
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
                              className={classNames('mb-4', className)}
                              {...props}
                            >
                              {children}
                            </p>
                          )
                        },
                        pre({ className, children, ...props }) {
                          return (
                            <pre
                              className={classNames('mb-4 text-sm', className)}
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
                                'mb-4 list-disc pl-4',
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
                                'mb-4 list-decimal pl-4',
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
                              className={classNames('mb-4 ', className)}
                              {...props}
                            >
                              {children}
                            </li>
                          )
                        }
                      }}
                    >
                      {messages[id].answers.join('')}
                    </ReactMarkdown>
                  )}
                </ChatBubble>
              </>
            ))}
          </>
        )}
      </section>

      <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-dark-main-bg">
        <LinearPaperclipIcon className="mr-6" />
        <section className="relative flex w-full ">
          <input
            value={question}
            type="text"
            className="flex-1 rounded-xl border-2 border-main-gray pb-3.5 pl-5 pr-5 pt-3.5 text-sm text-black text-opacity-40 outline-none dark:border-dark-search-input-border dark:bg-dark-search-input dark:text-dark-text-sub"
            placeholder="Type a message"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div onClick={onSearch}>
            <BoldSendIcon
              className="absolute right-5 top-3.5 cursor-pointer"
              pathClassName={classNames({
                'text-main-purple dark:text-main-purple transition duration-250 ease-in-out':
                  question.trim().length > 0
              })}
            />
          </div>
        </section>
      </section>
    </section>
  )
}

export default ChatBox
