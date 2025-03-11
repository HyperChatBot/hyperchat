import { CallingToolsProps } from '@/types'
import { Parser } from 'expr-eval'
import { z } from 'zod'

export const callingToolName = 'calculator'

export const toolFn = {
  [callingToolName]: {
    description:
      'Useful for getting the result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by a simple calculator.',
    parameters: z.object({ expression: z.string() }),
    execute: async ({ expression }: { expression: string }) => {
      try {
        return Parser.evaluate(expression).toString()
      } catch {
        return "I don't know how to do that."
      }
    }
  }
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>{'result' in toolInvocation ? <p>{toolInvocation.result}</p> : null}</>
  )
}
