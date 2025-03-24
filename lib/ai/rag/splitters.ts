import { Document } from '@langchain/core/documents'
import {
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter
} from '@langchain/textsplitters'

export const transformTextsToLangChainDocument = async (texts: string[]) => {
  const splitter = new RecursiveCharacterTextSplitter()
  const document = await splitter.createDocuments(texts)
  return document
}

export const generateChunksByMarkdownTextSplitter = async (
  input: string,
  chunkSize = 1000,
  chunkOverlap = 200
): Promise<string[]> => {
  const splitter = new MarkdownTextSplitter({
    chunkSize,
    chunkOverlap
  })
  const output = await splitter.splitText(input)
  return output
}

export const generateChunksByRecursiveCharacterTextSplitter = async (
  document: Document[],
  chunkSize = 1024,
  chunkOverlap = 128
): Promise<Document[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap
  })

  const output = await splitter.splitDocuments(document)
  return output
}
