import { Document } from '@langchain/core/documents'
import {
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter
} from '@langchain/textsplitters'

export const generateChunksByMarkdownTextSplitter = async (
  input: string
): Promise<string[]> => {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })
  const output = await splitter.splitText(input)
  return output
}

export const generateChunksByRecursiveCharacterTextSplitter = async (
  document: Document[]
): Promise<Document[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 128
  })

  const output = await splitter.splitDocuments(document)
  return output
}
