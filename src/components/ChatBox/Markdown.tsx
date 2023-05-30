import classNames from 'classnames'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeMathjax from 'rehype-mathjax'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface Props {
  raw: string
}

const Markdown: FC<Props> = ({ raw }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline ? (
            <SyntaxHighlighter
              style={mdCodeTheme}
              language={match ? match[1] : ''}
              PreTag="div"
              customStyle={{ borderRadius: 0, margin: 0 }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={classNames('font-semibold', className)}>
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
            >
              {children}
            </pre>
          )
        },
        ol({ className, children, ...props }) {
          const _props = { ...props, ordered: props.ordered.toString() }
          return (
            <ol
              className={classNames('mb-3 list-disc pl-3 last:mb-0', className)}
              {..._props}
            >
              {children}
            </ol>
          )
        },
        ul({ className, children, ...props }) {
          const _props = { ...props, ordered: props.ordered.toString() }
          return (
            <ul
              className={classNames(
                'mb-3 list-decimal pl-3 last:mb-0',
                className
              )}
              {..._props}
            >
              {children}
            </ul>
          )
        },
        li({ className, children, ...props }) {
          const _props = { ...props, ordered: props.ordered.toString() }
          return (
            <li className={classNames('mb-3 last:mb-0', className)} {..._props}>
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
