import { generateObject } from 'ai'
import { z } from 'zod'
import { o3MiniModel } from './models'
import { deepResearchPrompt, researchPlanPrompt } from './prompts'

export async function generateFeedback({
  query,
  numQuestions = 3
}: {
  query: string
  numQuestions?: number
}) {
  const userFeedback = await generateObject({
    model: o3MiniModel,
    system: deepResearchPrompt,
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>`,
    schema: z.object({
      questions: z
        .array(z.string())
        .describe(
          `Follow up questions to clarify the research direction, max of ${numQuestions}`
        )
    })
  })

  return userFeedback.object.questions.slice(0, numQuestions)
}

export async function generateResearchPlan(query: string) {
  const response = await generateObject({
    model: o3MiniModel,
    system: researchPlanPrompt,
    prompt: query,
    schema: z.object({
      queries: z.string().array().describe(`List of the research plan`)
    })
  })

  return response.object.queries
}
