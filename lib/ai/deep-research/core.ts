import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import * as cheerio from 'cheerio'
import { search, SearchResult } from 'duck-duck-scrape'
import { compact } from 'lodash-es'
import pLimit from 'p-limit'
import TurndownService from 'turndown'
import { z } from 'zod'
import { deepResearchPrompt } from '../prompts'
import { generateChunksByMarkdownTextSplitter } from '../rag'
import {
  generateChunksByRecursiveCharacterTextSplitter,
  transformTextsToLangChainDocument
} from '../rag/splitters'

interface ResearchResult {
  learnings: string[]
  visitedUrls: string[]
}

interface ResearchProgress {
  currentDepth: number
  totalDepth: number
  currentBreadth: number
  totalBreadth: number
  currentQuery?: string
  totalQueries: number
  completedQueries: number
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
})

const o3MiniModel = openai('o3-mini', {
  reasoningEffort: 'medium',
  structuredOutputs: true
})

async function loadHtmlFromUrl(url: string) {
  const $ = await cheerio.fromURL(url)

  $('style').remove()
  $('script').remove()

  return $.html()
}

function htmlToMarkdown(domString: string) {
  const turndownService = new TurndownService()
  return turndownService.turndown(domString)
}

async function searchWeb(query: string, limit = 5) {
  const { results } = await search(query, {
    locale: 'en-us'
  })

  return results.slice(0, limit)
}

async function generateSerpQueries({
  query,
  numQueries = 3,
  learnings
}: {
  query: string
  numQueries?: number

  // optional, if provided, the research will continue from the last learning
  learnings?: string[]
}) {
  const response = await generateObject({
    model: o3MiniModel,
    system: deepResearchPrompt(),
    prompt: `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${numQueries} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${query}</prompt>\n\n${
      learnings
        ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join(
            '\n'
          )}`
        : ''
    }`,
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
  console.log(
    `Created ${response.object.queries.length} queries`,
    response.object.queries
  )

  return response.object.queries.slice(0, numQueries)
}

async function transformSerpToChunks(results: SearchResult[]) {
  const chuncks = []

  for (const result of results) {
    const htmlStr = await loadHtmlFromUrl(result.url)
    const markdown =
      `# ${result.title}\n` +
      `> ${result.description} \n` +
      htmlToMarkdown(htmlStr)

    const chunk = await generateChunksByMarkdownTextSplitter(markdown)
    chuncks.push(...chunk)
  }

  return chuncks
}

async function learningsToChunks(learnings: string[]) {
  const document = await transformTextsToLangChainDocument(
    learnings.map((learning) => `<learning>\n${learning}\n</learning>`)
  )
  const learningsString = await generateChunksByRecursiveCharacterTextSplitter(
    document,
    150_000
  )

  return learningsString
}

async function processSerpResult({
  query,
  searchResults,
  numLearnings = 3,
  numFollowUpQuestions = 3
}: {
  query: string
  searchResults: SearchResult[]
  numLearnings?: number
  numFollowUpQuestions?: number
}) {
  const contents = await transformSerpToChunks(searchResults)
  console.log(`Ran ${query}, found ${contents.length} contents`)

  const response = await generateObject({
    model: o3MiniModel,
    abortSignal: AbortSignal.timeout(60_000),
    system: deepResearchPrompt(),
    prompt: `Given the following contents from a SERP search for the query <query>${query}</query>, generate a list of learnings from the contents. Return a maximum of ${numLearnings} learnings, but feel free to return less if the contents are clear. Make sure each learning is unique and not similar to each other. The learnings should be concise and to the point, as detailed and information dense as possible. Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any exact metrics, numbers, or dates. The learnings will be used to research the topic further.\n\n<contents>${contents
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
  console.log(
    `Created ${response.object.learnings.length} learnings`,
    response.object.learnings
  )

  return response.object
}

export async function writeFinalReport({
  prompt,
  learnings,
  visitedUrls
}: {
  prompt: string
  learnings: string[]
  visitedUrls: string[]
}) {
  const learningsString = await learningsToChunks(
    learnings.map((learning) => `<learning>\n${learning}\n</learning>`)
  )

  const response = await generateObject({
    model: o3MiniModel,
    system: deepResearchPrompt(),
    prompt: `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as as detailed as possible, aim for 3 or more pages, include ALL the learnings from research:\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from previous research:\n\n<learnings>\n${learningsString}\n</learnings>`,
    schema: z.object({
      reportMarkdown: z
        .string()
        .describe('Final report on the topic in Markdown')
    })
  })

  const urlsSection = `\n\n## Sources\n\n${visitedUrls.map((url) => `- ${url}`).join('\n')}`
  return response.object.reportMarkdown + urlsSection
}

export async function writeFinalAnswer({
  prompt,
  learnings
}: {
  prompt: string
  learnings: string[]
}) {
  const learningsString = await learningsToChunks(
    learnings.map((learning) => `<learning>\n${learning}\n</learning>`)
  )

  const response = await generateObject({
    model: o3MiniModel,
    system: deepResearchPrompt(),
    prompt: `Given the following prompt from the user, write a final answer on the topic using the learnings from research. Follow the format specified in the prompt. Do not yap or babble or include any other text than the answer besides the format specified in the prompt. Keep the answer as concise as possible - usually it should be just a few words or maximum a sentence. Try to follow the format specified in the prompt (for example, if the prompt is using Latex, the answer should be in Latex. If the prompt gives multiple answer choices, the answer should be one of the choices).\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from research on the topic that you can use to help answer the prompt:\n\n<learnings>\n${learningsString}\n</learnings>`,
    schema: z.object({
      exactAnswer: z
        .string()
        .describe(
          'The final answer, make it short and concise, just the answer, no other text'
        )
    })
  })

  return response.object.exactAnswer
}

export async function deepResearch({
  query,
  breadth,
  depth,
  learnings = [],
  visitedUrls = [],
  onProgress
}: {
  query: string
  breadth: number
  depth: number
  learnings?: string[]
  visitedUrls?: string[]
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
    query,
    learnings,
    numQueries: breadth
  })

  reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query
  })

  const limit = pLimit(2)
  const researchResults = await Promise.all(
    serpQueries.map((serpQuery) =>
      limit(async () => {
        try {
          const searchResults = await searchWeb(query)

          const newUrls = compact(searchResults.map((item) => item.url))
          const newBreadth = Math.ceil(breadth / 2)
          const newDepth = depth - 1

          const newLearnings = await processSerpResult({
            query: serpQuery.query,
            searchResults,
            numFollowUpQuestions: newBreadth
          })
          const allLearnings = [...learnings, ...newLearnings.learnings]
          const allUrls = [...visitedUrls, ...newUrls]

          if (newDepth > 0) {
            console.log(
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
              query: nextQuery,
              breadth: newBreadth,
              depth: newDepth,
              learnings: allLearnings,
              visitedUrls: allUrls,
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
              visitedUrls: allUrls
            }
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message &&
            error.message.includes('Timeout')
          ) {
            console.log(
              `Timeout error running query: ${serpQuery.query}: `,
              error
            )
          } else {
            console.log(`Error running query: ${serpQuery.query}: `, error)
          }
          return {
            learnings: [],
            visitedUrls: []
          }
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
    visitedUrls: [
      ...new Set(
        researchResults.flatMap(
          (researchResults) => researchResults.visitedUrls
        )
      )
    ]
  }
}
