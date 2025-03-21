import { customsearch_v1 } from '@googleapis/customsearch'
import { generateObject } from 'ai'
import pLimit from 'p-limit'
import { z } from 'zod'
import { transformDocumentIntoChunks } from './load-url'
import { o3MiniModel } from './models'
import { deepResearchPrompt, queriesGenerationPrompt } from './prompts'
import { sendSse } from './sse'
import { isTimeout, setSleep } from './timer'
import { DocumentData, ResearchProgress, ResearchResult } from './types'
import { searchWeb } from './web-search'

let timestamp: number | null = null

async function generateSerpQueries({
  controller,
  query,
  numQueries = 3,
  learnings
}: {
  controller: ReadableStreamDefaultController
  query: string
  numQueries?: number
  learnings?: string[] // optional, if provided, the research will continue from the last learning
}) {
  const response = await generateObject({
    model: o3MiniModel,
    system: deepResearchPrompt,
    prompt: queriesGenerationPrompt(query, numQueries, learnings),
    schema: z.object({
      queries: z
        .array(
          z.object({
            query: z.string().describe('The SERP query'),
            researchGoal: z
              .string()
              .describe(
                'First talk about the goal of the research that this query is meant to accomplish, then go deeper into how to advance the research once the results are found, mention additional research directions. Be as specific as possible, especially for additional research directions.'
              )
          })
        )
        .describe(`List of SERP queries, max of ${numQueries}`)
    })
  })

  sendSse(
    controller,
    `Created ${response.object.queries.length} queries: \n \`\`\`json\n${JSON.stringify(response.object.queries, null, 2)}`
  )

  return response.object.queries.slice(0, numQueries)
}

async function processSerpResult({
  controller,
  query,
  searchResults,
  visitedUrls = new Map(),
  numLearnings = 3,
  numFollowUpQuestions = 3
}: {
  controller: ReadableStreamDefaultController
  query: string
  searchResults: customsearch_v1.Schema$Result[]
  visitedUrls: Map<string, DocumentData>
  numLearnings?: number
  numFollowUpQuestions?: number
}) {
  const totalChuncks = await transformDocumentIntoChunks({
    controller,
    results: searchResults,
    visitedUrls
  })

  const responses: { learnings: string[]; followUpQuestions: string[] } = {
    learnings: [],
    followUpQuestions: []
  }

  if (!totalChuncks) {
    return responses
  }

  sendSse(
    controller,
    `Research query: **${query}**, found **${totalChuncks?.reduce((acc, val) => acc + val.length, 0)}** contents${Array.isArray(totalChuncks) && totalChuncks?.length > 1 ? `, due to the OpenAI's rate limits policy, We need to learn all the documents in ${totalChuncks.length} parts.` : '.'}`
  )

  for (let i = 0; i < totalChuncks.length; i++) {
    if (timestamp && !isTimeout(timestamp)) {
      await setSleep({ controller, timestamp })
    }

    const response = await generateObject({
      model: o3MiniModel,
      system: deepResearchPrompt,
      prompt: `Given the following contents from a SERP search for the query <query>${query}</query>, generate a list of learnings from the contents. Return a maximum of ${numLearnings} learnings, but feel free to return less if the contents are clear. Make sure each learning is unique and not similar to each other. The learnings should be concise and to the point, as detailed and information dense as possible. Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any exact metrics, numbers, or dates. The learnings will be used to research the topic further.\n\n<contents>${totalChuncks[
        i
      ]
        .map((content) => `<content>\n${content}\n</content>`)
        .join('\n')}</contents>`,
      schema: z.object({
        learnings: z
          .array(z.string())
          .describe(`List of learnings, max of ${numLearnings}`),
        followUpQuestions: z
          .array(z.string())
          .describe(
            `List of follow-up questions to research the topic further, max of ${numFollowUpQuestions}`
          )
      })
    })
    timestamp = performance.now()

    if (totalChuncks.length > 1) {
      sendSse(
        controller,
        `Created ${response.object.learnings.length} learnings in **part ${i + 1}**: \n\`\`\`json\n${JSON.stringify(response.object.learnings, null, 2)}`
      )
    }

    // TODO: Perhaps this is not a good idea.
    // Adding the previous learnings to the next for-loop's prompt would make it more reasonable.
    responses.learnings = [...responses.learnings, ...response.object.learnings]
    responses.followUpQuestions = [
      ...responses.followUpQuestions,
      ...response.object.followUpQuestions
    ]
  }

  sendSse(
    controller,
    `Created ${responses.learnings.length} learnings totally: \n\`\`\`json\n${JSON.stringify(responses.learnings, null, 2)}`
  )

  timestamp = null
  return responses
}

export async function deepResearch({
  controller,
  query,
  breadth,
  depth,
  learnings = [],
  visitedUrls = new Map(),
  onProgress
}: {
  controller: ReadableStreamDefaultController
  query: string
  breadth: number
  depth: number
  learnings?: string[]
  visitedUrls?: Map<string, DocumentData>
  onProgress?: (progress: ResearchProgress) => void
}): Promise<ResearchResult> {
  const progress: ResearchProgress = {
    currentDepth: depth,
    totalDepth: depth,
    currentBreadth: breadth,
    totalBreadth: breadth,
    totalQueries: 0,
    completedQueries: 0
  }

  const reportProgress = (update: Partial<ResearchProgress>) => {
    Object.assign(progress, update)
    onProgress?.(progress)
  }

  const serpQueries = await generateSerpQueries({
    controller,
    query,
    learnings,
    numQueries: breadth
  })

  reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query
  })

  const limit = pLimit(1)
  const researchResults = await Promise.all(
    serpQueries.map((serpQuery) =>
      limit(async () => {
        try {
          const searchResults = await searchWeb({ controller, query })

          if (!searchResults) {
            sendSse(
              controller,
              `Your query: "${query}" did not match any documents.`
            )

            throw new Error('Your search did not match any documents.')
          }

          const newBreadth = Math.ceil(breadth / 2)
          const newDepth = depth - 1

          const newLearnings = await processSerpResult({
            controller,
            query: serpQuery.query,
            searchResults,
            visitedUrls,
            numFollowUpQuestions: newBreadth
          })

          const allLearnings = [...learnings, ...newLearnings.learnings]

          if (newDepth > 0) {
            sendSse(
              controller,
              `Researching deeper, breadth: ${newBreadth}, depth: ${newDepth}`
            )

            reportProgress({
              currentDepth: newDepth,
              currentBreadth: newBreadth,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query
            })

            const nextQuery = `
            Previous research goal: ${serpQuery.researchGoal}
            Follow-up research directions: ${newLearnings.followUpQuestions.map((q) => `\n${q}`).join('')}
          `.trim()

            return deepResearch({
              controller,
              query: nextQuery,
              breadth: newBreadth,
              depth: newDepth,
              learnings: allLearnings,
              visitedUrls,
              onProgress
            })
          } else {
            reportProgress({
              currentDepth: 0,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query
            })
            return {
              learnings: allLearnings,
              visitedUrls
            }
          }
        } catch (error) {
          sendSse(
            controller,
            `Error running query: **${serpQuery.query}**${error instanceof Error ? ` due to *${error.message}*` : ''}`
          )

          return {
            learnings: [],
            visitedUrls: new Map()
          } as ResearchResult
        }
      })
    )
  )

  return {
    learnings: [
      ...new Set(
        researchResults.flatMap((researchResults) => researchResults.learnings)
      )
    ],
    visitedUrls
  }
}
