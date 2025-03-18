import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as readline from 'readline'
import { deepResearch } from './deep-research'
import { generateFeedback } from './feedback'
import { o3MiniModel } from './models'
import { writeFinalAnswer, writeFinalReport } from './report'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Helper function to get user input
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

// run the agent
async function run() {
  console.log(chalk.blue(`Using model: "${o3MiniModel.modelId}"\n`))

  // Get initial query
  const initialQuery = await askQuestion('What would you like to research? ')

  // Get breath and depth parameters
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
  const isReport =
    (await askQuestion(
      'Do you want to generate a long report or a specific answer? (report/answer, default report): '
    )) === 'report'

  let combinedQuery = initialQuery
  if (isReport) {
    console.log(chalk.blue(`Creating research plan...\n`))

    // Generate follow-up questions
    const followUpQuestions = await generateFeedback({
      query: initialQuery
    })

    console.log(
      chalk.blue(
        'To better understand your research needs, please answer these follow-up questions:\n'
      )
    )

    // Collect answers to follow-up questions
    const answers: string[] = []
    for (const question of followUpQuestions) {
      const answer = await askQuestion(`\n${question}\nYour answer: `)
      answers.push(answer)
    }

    // Combine all information for deep research
    combinedQuery = `
Initial Query: ${initialQuery}
Follow-up Questions and Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}
`
  }

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

  if (isReport) {
    const report = await writeFinalReport({
      prompt: combinedQuery,
      learnings,
      visitedUrls
    })

    await fs.writeFile('report.md', report, 'utf-8')
    console.log(chalk.blue(`Final Report:\n${report}\n`))
    console.log(chalk.blue('Report has been saved to report.md\n'))
  } else {
    const answer = await writeFinalAnswer({
      prompt: combinedQuery,
      learnings
    })

    await fs.writeFile('answer.md', answer, 'utf-8')
    console.log(chalk.blue(`Final Answer:\n${answer}\n`))
    console.log(chalk.blue('Answer has been saved to answer.md\n'))
  }

  rl.close()
}

run().catch(console.error)
