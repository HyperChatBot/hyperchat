import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as readline from 'readline'
import { deepResearch } from './deep-research'
import { generateFeedback } from './feedback'
import { o3MiniModel } from './models'
import { writeFinalReport } from './report'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

async function run() {
  console.log(chalk.blue(`Using model: "${o3MiniModel.modelId}"\n`))

  const initialQuery = await askQuestion('What would you like to research? ')

  const breadth =
    parseInt(
      await askQuestion(
        'Enter research breadth (recommended 2-10, default 4): '
      ),
      10
    ) || 4
  const depth =
    parseInt(
      await askQuestion('Enter research depth (recommended 1-5, default 2): '),
      10
    ) || 2

  let combinedQuery = initialQuery
  console.log(chalk.blue(`Creating research plan...\n`))

  const followUpQuestions = await generateFeedback({
    query: initialQuery
  })

  console.log(
    chalk.blue(
      'To better understand your research needs, please answer these follow-up questions:\n'
    )
  )

  const answers: string[] = []
  for (const question of followUpQuestions) {
    const answer = await askQuestion(`\n${question}\nYour answer: `)
    answers.push(answer)
  }

  combinedQuery = `
Initial Query: ${initialQuery}
Follow-up Questions and Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}
`

  console.log(chalk.blue('Starting research...\n'))

  const { learnings, visitedUrls } = await deepResearch({
    query: combinedQuery,
    breadth,
    depth
  })

  console.log(chalk.blue(`Learnings:\n${learnings.join('\n')}\n`))
  console.log(
    chalk.blue(
      `\nVisited URLs (${visitedUrls.length}):\n${visitedUrls.join('\n')}\n`
    )
  )
  console.log(chalk.blue('Writing final report...\n'))

  const report = await writeFinalReport({
    prompt: combinedQuery,
    learnings,
    visitedUrls
  })

  await fs.writeFile('report.md', report, 'utf-8')
  console.log(chalk.blue(`Final Report:\n${report}\n`))
  console.log(chalk.blue('Report has been saved to report.md\n'))

  rl.close()
}

run().catch(console.error)
