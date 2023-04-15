import classNames from 'classnames'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

const Markdown: FC<Props> = ({ content }) => {
  return (
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
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={classNames('font-semibold', className)} {...props}>
              `{children}`
            </code>
          )
        },
        p({ className, children, ...props }) {
          return (
            <p className={classNames('mb-2', className)} {...props}>
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
              className={classNames('mb-2 list-disc pl-4', className)}
              {...props}
            >
              {children}
            </ol>
          )
        },
        ul({ className, children, ...props }) {
          return (
            <ul
              className={classNames('mb-2 list-decimal pl-4', className)}
              {...props}
            >
              {children}
            </ul>
          )
        },
        li({ className, children, ...props }) {
          return (
            <li className={classNames('mb-2', className)} {...props}>
              {children}
            </li>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
