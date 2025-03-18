import chalk from 'chalk'
import { sleep } from 'yancey-js-util'

export function isTimeout(timestamp: number) {
  const current = performance.now()
  return current - timestamp > 60_000
}

export async function setSleep(timestamp: number) {
  const current = performance.now()

  const sleepMilliseconds = 60_000 - (current - timestamp)
  console.log(
    chalk.yellowBright(
      `Duo the OpenAI's rate limits policy, please wait ${(sleepMilliseconds / 1000).toFixed(2)}s for the next process.`
    )
  )
  await sleep(sleepMilliseconds)
}
