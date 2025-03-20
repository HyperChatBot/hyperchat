import { generateObject } from 'ai'
import { z } from 'zod'
import {
  generateChunksByRecursiveCharacterTextSplitter,
  transformTextsToLangChainDocument
} from '../rag'
import { o3MiniModel } from './models'
import { deepResearchPrompt } from './prompts'

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
    system: deepResearchPrompt,
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
