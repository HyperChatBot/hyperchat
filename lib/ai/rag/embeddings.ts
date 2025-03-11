import { openai } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'

export interface Embedding {
  embedding: number[]
  content: string
}

// transform user's prompt to embedding vector
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input
  })
  return embedding
}

// bath transform knowledge bases to embedding vector
export const generateEmbeddings = async (
  chunks: string[]
): Promise<Embedding[]> => {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-ada-002'),
    values: chunks
  })

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}
