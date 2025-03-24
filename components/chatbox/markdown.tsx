import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { Marked, Renderer, Tokens } from 'marked'
import markedKatex from 'marked-katex-extension'
import { FC, memo, useCallback } from 'react'

interface Props {
  src: string
}

const Markdown: FC<Props> = ({ src }) => {
  const parseMarkdown = useCallback(() => {
    const renderer = new Renderer()

    renderer.code = ({ text, lang }: Tokens.Code) => {
      const language = (lang && lang.split(/\s/)[0]) ?? 'javascript'

      const highlighted =
        language && hljs.getLanguage(language)
          ? hljs.highlight(text, { language: language }).value
          : hljs.highlightAuto(text).value

      return `<pre class="mb-4 rounded-xl overflow-x-scroll text-xs"><code class=" hljs ${language}">${highlighted}</code></pre>`
    }

    renderer.codespan = ({ text }: Tokens.Codespan) =>
      `<code class="px-[6px] py-[1px] text-xs text-primary rounded-[6px] bg-accent">${text}</code>`

    renderer.image = ({ text, href }: Tokens.Image) => {
      return `<img src="${href}" alt="${text}" class="mb-3" loading="lazy" />`
    }

    renderer.link = ({ href, text }: Tokens.Link) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="font-bold underline">${text}</a>`
    }

    const marked = new Marked({
      renderer: {
        ...renderer,
        table(...args) {
          return `<div class="rounded-md border overflow-x-scroll mb-4">${renderer.table.apply(this, args)}</div>`
        }
      }
    })

    marked.use(markedKatex())

    return marked.parse(src)
  }, [src])

  return (
    <section
      className="markdown"
      dangerouslySetInnerHTML={{ __html: parseMarkdown() }}
    />
  )
}

export default memo(Markdown)
