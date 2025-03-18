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
    system: deepResearchPrompt,
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
