import { sleep } from 'yancey-js-util'
import { sendSse } from './sse'

export function isTimeout(timestamp: number) {
  const current = performance.now()
  return current - timestamp > 60_000
}

export async function setSleep({
  controller,
  timestamp
}: {
  controller: ReadableStreamDefaultController
  timestamp: number
}) {
  const current = performance.now()

  const sleepMilliseconds = 60_000 - (current - timestamp)
  sendSse(
    controller,
    `Due to the OpenAI's rate limits policy, please wait for ${(sleepMilliseconds / 1000).toFixed(2)}s to the next process.`
  )
  await sleep(sleepMilliseconds)
}
