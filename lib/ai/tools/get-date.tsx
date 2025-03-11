import { CallingToolsProps } from '@/types'
import { addDays, format } from 'date-fns'
import { z } from 'zod'

export const callingToolName = 'getDate'

export const toolFn = {
  [callingToolName]: {
    description:
      'Display date to the user. You should give the offset as a parameter to today.',
    parameters: z.object({ offset: z.number() }),
    execute: async ({ offset }: { offset: number }) => {
      return format(addDays(new Date(), offset), 'PPPP')
    }
  }
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>{'result' in toolInvocation ? <p>{toolInvocation.result}</p> : null}</>
  )
}
