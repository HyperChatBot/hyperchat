import Markdown from '@/components/chatbox/markdown'
import { CallingToolsProps } from '@/types'
import { tool } from 'ai'
import { z } from 'zod'

export const callingToolName = 'retrieveUsingRag'

export const toolFn = {
  [callingToolName]: tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question')
    })
    // execute: async ({ question }) => findRelevantContent(question)
  })
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>
      {'result' in toolInvocation ? (
        <Markdown src={toolInvocation.result?.[0]?.name as string} />
      ) : null}
    </>
  )
}
