import { generateObject } from 'ai'
import { z } from 'zod'
import { o3MiniModel } from './models'
import { deepResearchPrompt } from './prompts'
import { DocumentData } from './types'

export async function writeFinalReport({
  prompt,
  learnings,
  visitedUrls
}: {
  prompt: string
  learnings: string[]
  visitedUrls: Map<string, DocumentData>
}) {
  const learningsString = learnings
    .map((learning) => `<learning>\n${learning}\n</learning>`)
    .join('\n')

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

  const urlsSection = `\n\n## Sources\n\n${[...visitedUrls.keys()].map((url) => `- ${url}`).join('\n')}`
  return response.object.reportMarkdown + urlsSection
}
