'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function AiMail() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/ai-mail')

    eventSource.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      {messages.map((message, idx) => (
        <Card key={idx} className="mb-4 p-4">
          {message}
        </Card>
      ))}
    </div>
  )
}
