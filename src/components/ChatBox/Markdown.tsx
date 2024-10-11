import classNames from 'classnames'
import { FC, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as mdCodeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
// @ts-ignore
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
      // @ts-ignore
      rehypePlugins={[rehypeMathjax]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              style={mdCodeTheme}
              language={match[1]}
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
        },
        img({ className, children, ...props }) {
          return <img {...props} loading="lazy" />
        },
        a({ className, children, ...props }) {
          return (
            <a
              {...props}
              rel="noopener noreferrer"
              target="_blank"
              className={classNames('font-bold underline', className)}
            >
              {children}
            </a>
          )
        },
        table({ className, children, ...props }) {
          return (
            <table
              className={classNames(
                'table-fixed border border-gray-500',
                className
              )}
            >
              {children}
            </table>
          )
        },
        th({ className, children, ...props }) {
          return (
            <th
              className={classNames(
                'whitespace-nowrap border border-gray-500 p-2 dark:border-gray-200',
                className
              )}
            >
              {children}
            </th>
          )
        },
        td({ className, children, ...props }) {
          return (
            <td
              className={classNames(
                'whitespace-nowrap border border-gray-500 p-2 dark:border-gray-200',
                className
              )}
            >
              {children}
            </td>
          )
        }
      }}
    >
      {raw}
    </ReactMarkdown>
  )
}

export default memo(
  Markdown,
  (prevProps, nextProps) => prevProps.raw === nextProps.raw
)
