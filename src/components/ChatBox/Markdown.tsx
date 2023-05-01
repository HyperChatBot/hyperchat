import classNames from 'classnames'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface Props {
  raw: string
}

const Markdown: FC<Props> = ({ raw }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          // @ts-ignore
          // FIXME: ReactMarkdown sometimes fails to recognize multi-line code blocks,
          // so temporarily relies on the presence of '\n' in the text to determine them.
          const isMultiLines = props.node.children[0].value.includes('\n')
          const match = /language-(\w+)/.exec(className || '')
          return isMultiLines || (!inline && match) ? (
            <SyntaxHighlighter
              // @ts-ignore
              style={mdCodeTheme}
              language={match ? match[1] : 'js'}
              PreTag="div"
              customStyle={{ borderRadius: 0, margin: 0 }}
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
            <p
              className={classNames(
                'mb-3 whitespace-pre-wrap break-words last:mb-0',
                className
              )}
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
                '-mx-4 my-3 overflow-x-scroll text-xs last:my-0',
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
              className={classNames('mb-3 list-disc pl-3 last:mb-0', className)}
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
                'mb-3 list-decimal pl-3 last:mb-0',
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
            <li className={classNames('mb-3 last:mb-0', className)} {...props}>
              {children}
            </li>
          )
        }
      }}
    >
      {raw}
    </ReactMarkdown>
  )
}

export default Markdown
