'use client'

import Markdown from '@/components/chatbox/markdown'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  query: z.string().min(1),
  breadth: z.coerce.number().min(2).max(10).default(4),
  depth: z.coerce.number().min(1).max(5).default(2),
  feedbacks: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1)
    })
  )
})

enum Steps {
  AskForFeedback,
  FillInFeedback,
  RunDeepSearch
}

export default function DeepResearch() {
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState(Steps.AskForFeedback)
  const [messages, setMessages] = useState<string[]>([])
  const ref = useRef<HTMLDivElement | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      breadth: 4,
      depth: 2,
      feedbacks: []
    }
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'feedbacks'
  })

  async function fetchFeedback(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ query: values.query })
      })
      const questions: string[] = await response.json()
      form.setValue(
        'feedbacks',
        questions.map((question) => ({
          question,
          answer: ''
        }))
      )

      setSteps(Steps.FillInFeedback)
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (steps === Steps.AskForFeedback) {
      fetchFeedback(values)
    }

    if (steps === Steps.FillInFeedback) {
      setSteps(Steps.RunDeepSearch)
    }
  }

  useEffect(() => {
    if (steps !== Steps.RunDeepSearch) return

    const { query, feedbacks, breadth, depth } = form.getValues()

    const combinedQuery = `
    Initial Query: ${query}
    Follow-up Questions and Answers:
    ${feedbacks.map(({ question, answer }) => `Q: ${question}\nA: ${answer}`).join('\n')}
    `

    const params = new URLSearchParams()
    params.append('query', combinedQuery)
    params.append('breadth', breadth.toString())
    params.append('depth', depth.toString())
    const encodedQuery = params.toString()

    const source = new EventSource(`/api/deep-research?${encodedQuery}`)

    source.onopen = () => {
      setLoading(true)
      console.log('SSE connection opened')
    }

    source.onmessage = (event) => {
      try {
        const { data } = JSON.parse(event.data)
        if (data === '__END__') {
          setLoading(false)
          source.close()
        } else {
          setMessages((prev) => [...prev, data])
        }
      } catch (error) {
        console.error('Error parsing event data:', error)
        source.close()
      }
    }

    source.onerror = (error) => {
      console.error('SSE error:', error)
      if (source.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed')
      }
      source.close()
    }

    return () => {
      if (source) {
        console.log('SSE connection closed by component unmount')
        source.close()
      }
    }
  }, [form, steps])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight)
    }
  }, [messages])

  return (
    <section className="flex min-h-dvh gap-4 p-4">
      <Card className="max-h-[calc(100dvh-2rem)] w-1/3 shrink-0 overflow-y-scroll p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to research?"
                      className="min-h-40 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breadth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Breadth</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter research breadth (recommended 2-10, default 4)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Depth</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter research depth (recommended 1-5, default 2)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.length > 0 ? (
              <div className="mt-6">
                <Separator />
                <h2 className="mt-6 font-bold">
                  To better understand your research needs, please answer these
                  follow-up questions:
                </h2>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="mt-4 space-y-4 rounded-md border p-4 shadow-sm"
                  >
                    <p className="text-sm">{field.question}</p>
                    <FormField
                      control={form.control}
                      name={`feedbacks.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Enter your answer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </Card>
      <Card
        className="flex max-h-[calc(100dvh-2rem)] flex-auto flex-col gap-0 overflow-y-scroll p-4"
        ref={ref}
      >
        {messages.map((message, idx) => (
          <section key={idx} className="flex flex-col">
            <Markdown src={message} />
            {idx !== messages.length - 1 && <Separator className="mb-4" />}
          </section>
        ))}
      </Card>
    </section>
  )
}
