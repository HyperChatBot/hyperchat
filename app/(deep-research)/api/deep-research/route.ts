import { deepResearch } from '@/lib/ai/deep-research/deep-research'
import { writeFinalReport } from '@/lib/ai/deep-research/final-report'
import { sendSse } from '@/lib/ai/deep-research/sse'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  query: z.string().min(1),
  breadth: z.coerce.number().min(2).max(10).default(4),
  depth: z.coerce.number().min(1).max(5).default(2)
})

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const deserializedSearchParams = querySchema.safeParse(searchParams)

  if (!deserializedSearchParams.success) {
    return NextResponse.json(
      { error: deserializedSearchParams.error.format() },
      { status: 400 }
    )
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  }

  const stream = new ReadableStream({
    async start(controller) {
      const startTimestamp = performance.now()
      sendSse(controller, 'Starting research...')
      const { learnings, visitedUrls } = await deepResearch({
        ...deserializedSearchParams.data,
        controller
      })

      sendSse(
        controller,
        `Learnings:\n${learnings.map((learning) => `- ${learning}`).join('\n')}`
      )
      sendSse(
        controller,
        `Visited URLs (${visitedUrls.size}):\n${[...visitedUrls.keys()].map((url) => `- ${url}`).join('\n')}`
      )
      sendSse(controller, 'Writing final report...')

      const report = await writeFinalReport({
        prompt: deserializedSearchParams.data.query,
        learnings,
        visitedUrls
      })

      sendSse(controller, report)
      sendSse(
        controller,
        `It took a total of ${((performance.now() - startTimestamp) / 1000 / 60).toFixed(2)} minutes.`
      )

      sendSse(controller, '__END__')

      request.signal.onabort = () => {
        controller.close()
      }
    }
  })

  return new Response(stream, { headers })
}
