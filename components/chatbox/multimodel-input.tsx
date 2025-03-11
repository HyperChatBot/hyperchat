'use client'

import { UseChatHelpers } from '@ai-sdk/react'
import {
  AudioLines,
  CircleStop,
  Globe,
  Lightbulb,
  Palette,
  Plus,
  Send
} from 'lucide-react'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface Props {
  chatId: string
  input: string
  append: UseChatHelpers['append']
  messages: UseChatHelpers['messages']
  setMessages: UseChatHelpers['setMessages']
  setInput: UseChatHelpers['setInput']
  handleSubmit: UseChatHelpers['handleSubmit']
  status: UseChatHelpers['status']
  stop: UseChatHelpers['stop']
}

const InputBox: FC<Props> = ({
  chatId,
  input,
  setInput,
  handleSubmit,
  status
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`)
    handleSubmit()
    resetHeight()
  }, [handleSubmit, chatId])

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  return (
    <div className="border-input mx-auto mb-4 flex w-full flex-col gap-2 rounded-2xl border p-1 shadow-sm md:max-w-3xl">
      <form>
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInput}
          className="max-h-[calc(75dvh)] min-h-[24px] resize-none rounded-2xl border-none pb-6 shadow-none focus-visible:ring-0"
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()

              if (isTyping) {
                return
              }

              if (status === 'streaming') {
                toast.error('Please wait for the model to finish its response!')
              } else {
                submitForm()
              }
            }
          }}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />
      </form>
      <div className="mx-2 mb-2 flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" className="cursor-pointer rounded-4xl border">
            <Plus /> Attach
          </Button>
          <Button variant="ghost" className="cursor-pointer rounded-4xl border">
            <Lightbulb /> Reason
          </Button>
          <Button variant="ghost" className="cursor-pointer rounded-4xl border">
            <Globe /> Search
          </Button>
          <Button variant="ghost" className="cursor-pointer rounded-4xl border">
            <Palette /> Artifact
          </Button>
        </div>

        {status === 'streaming' ? (
          <Button variant="ghost" onClick={stop}>
            <CircleStop />
          </Button>
        ) : (
          <Button type="submit" variant="secondary">
            {input.trim() === '' ? <AudioLines /> : <Send />}
          </Button>
        )}
      </div>
    </div>
  )
}

export default memo(InputBox)
