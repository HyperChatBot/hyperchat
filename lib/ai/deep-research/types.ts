export interface ResearchResult {
  learnings: string[]
  visitedUrls: string[]
}

export interface ResearchProgress {
  currentDepth: number
  totalDepth: number
  currentBreadth: number
  totalBreadth: number
  currentQuery?: string
  totalQueries: number
  completedQueries: number
}

export interface DocumentData {
  chunks: string[]
  tokenCount: number
}
