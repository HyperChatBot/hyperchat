export interface ResearchResult {
  learnings: string[]
  visitedUrls: Map<string, DocumentData>
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
  document: string
  tokenCount: number
}
