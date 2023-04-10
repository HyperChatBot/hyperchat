import { FC, Fragment, useState } from 'react'
import { v4 } from 'uuid'
import { clone } from 'ramda'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeGfm from 'remark-gfm'
import 'katex/dist/katex.min.css'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'

interface MessageData {
  id: string
  q: string
  a: string
}

interface Message extends Omit<MessageData, 'a'> {
  a: string[]
}

interface MessageMapper {
  [id: string]: Message
}

const user_id = v4()

const ChatGPT: FC = () => {
  const [val, setVal] = useState('')
  const [messages, setMessages] = useState<MessageMapper | null>(null)

  const onSearch = () => {
    const evtSource = new EventSource(
      'BASE_URL' + '/create_chat' + `?q=${val}&user_id=${user_id}`,
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

    setVal('')

    evtSource.addEventListener(
      'chat/completions',
      (e: MessageEvent<string>) => {
        const { id, q, a } = JSON.parse(e.data) as MessageData

        setMessages((prevState) => {
          if (prevState) {
            const clonedMsg = clone(prevState)
            const currMsg = clonedMsg[id]

            if (currMsg) {
              currMsg.a = [...currMsg.a, a]
            } else {
              clonedMsg[id] = {
                id,
                q,
                a: [a]
              }
            }

            return clonedMsg
          } else {
            return {
              [id]: {
                id,
                q,
                a: [a]
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
    <section>
      <section style={{ display: 'flex' }}>
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          style={{ width: 400, marginRight: 20 }}
        />
        <Button variant="contained" onClick={onSearch} disabled={!val.trim()}>
          Search
        </Button>
      </section>
      {messages && (
        <>
          {Object.values(messages).map((msg) => (
            <Fragment key={msg.id}>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ marginTop: 2, maxWidth: 800 }}
              >
                Q: {msg.q}
              </Typography>

              <Card sx={{ maxWidth: 800, marginTop: 2, marginBottom: 2 }}>
                <CardContent sx={{ paddingBottom: '0!important' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
                            className={className}
                            {...props}
                            style={{ fontWeight: 'bold' }}
                          >
                            `{children}`
                          </code>
                        )
                      },
                      p({ className, children, ...props }) {
                        return (
                          <p
                            className={className}
                            {...props}
                            style={{ marginBottom: 16 }}
                          >
                            {children}
                          </p>
                        )
                      },
                      pre({ className, children, ...props }) {
                        return (
                          <pre
                            className={className}
                            {...props}
                            style={{ marginBottom: 16, fontSize: 14 }}
                          >
                            {children}
                          </pre>
                        )
                      },
                      ol({ className, children, ...props }) {
                        return (
                          <ol
                            className={className}
                            {...props}
                            style={{
                              marginBottom: 16,
                              listStyle: 'disc',
                              paddingLeft: 16
                            }}
                          >
                            {children}
                          </ol>
                        )
                      },
                      ul({ className, children, ...props }) {
                        return (
                          <ul
                            className={className}
                            {...props}
                            style={{
                              marginBottom: 16,
                              listStyle: 'decimal',
                              paddingLeft: 16
                            }}
                          >
                            {children}
                          </ul>
                        )
                      },
                      li({ className, children, ...props }) {
                        return (
                          <li
                            className={className}
                            {...props}
                            style={{ marginBottom: 16 }}
                          >
                            {children}
                          </li>
                        )
                      }
                    }}
                  >
                    {msg.a.join('')}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </Fragment>
          ))}
        </>
      )}
    </section>
  )
}

export default ChatGPT
