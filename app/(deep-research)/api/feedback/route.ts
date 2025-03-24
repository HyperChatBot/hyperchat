import { generateFeedback } from '@/lib/ai/deep-research/feedback'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { query }: { query: string } = await request.json()
  const feedback = await generateFeedback({ query })

  return NextResponse.json(feedback)
}
