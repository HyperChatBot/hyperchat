import '@/public/stylesheets/weather.css'
import { CallingToolsProps } from '@/types'
import { z } from 'zod'

export const callingToolName = 'getWeather'

export const toolFn = {
  [callingToolName]: {
    description: 'Display the weather in a given location to the user.',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }: { location: string }) => {
      try {
        const response = await fetch(`https://wttr.in/${location}`)
        const htmlString = await response.text()
        return htmlString.match(/<pre>(.*?)<\/pre>/s)?.[0]
      } catch {
        return ''
      }
    }
  }
}

export function Render({ toolInvocation }: CallingToolsProps) {
  return (
    <>
      {'result' in toolInvocation ? (
        <div
          className="my-4 text-xs"
          key={toolInvocation.toolCallId}
          dangerouslySetInnerHTML={{ __html: toolInvocation.result }}
        />
      ) : null}
    </>
  )
}

const callingTool = {
  callingToolName,
  toolFn,
  Render
}

export default callingTool
