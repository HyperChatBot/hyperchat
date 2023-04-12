import classNames from 'classnames'
import { clone } from 'ramda'
import { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import ChatBubble from '../ChatBubble'
import ContractHeader from '../ContactHeader'
import Divider from '../Divider'
import { BoldSendIcon, LinearPaperclipIcon } from '../Icons'

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
  const [content, setContent] = useState('')

  const onSearch = () => {
    const evtSource = new EventSource(
      'http://127.0.0.1:10086' +
        '/create_chat' +
        `?question=${content}&user_id=${''}`,
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

    setContent('')

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
    <section className="relative">
      <ContractHeader />
      <Divider />

      <section className="no-scrollbar relative h-[calc(100vh_-_10rem)] overflow-y-scroll p-6">
        {messages && (
          <>
            {Object.values(messages).map((msg) => (
              <>
                <ChatBubble role="assistant" avatar={''}>
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
                    {msg.answers.join('')}
                  </ReactMarkdown>
                </ChatBubble>
                <ChatBubble role="user" avatar="">
                  {msg.question}
                </ChatBubble>
              </>
            ))}
          </>
        )}

        <ChatBubble role="assistant" avatar="">
          <div className="flex animate-pulse items-center justify-center space-x-2 p-2">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <div className="h-2 w-2 rounded-full bg-black"></div>
          </div>
        </ChatBubble>
      </section>

      <section className="absolute bottom-6 left-6 flex w-[calc(100%_-_3rem)] items-center bg-white pt-6 dark:bg-dark-main-bg">
        <LinearPaperclipIcon className="mr-6" />
        <section className="relative flex w-full ">
          <input
            value={content}
            type="text"
            className="flex-1 rounded-xl border-2 border-main-gray pb-3.5 pl-5 pr-5 pt-3.5 text-sm text-black text-opacity-40 outline-none dark:border-dark-search-input-border dark:bg-dark-search-input dark:text-dark-text-sub"
            placeholder="Type a message"
            onChange={(e) => setContent(e.target.value)}
          />
          <div onClick={onSearch}>
            <BoldSendIcon className="absolute right-5 top-3.5 cursor-pointer" />
          </div>
        </section>
      </section>
    </section>
  )
}

export default ChatBox
