export interface AzureImageGenerationResult {
  caption: string
  contentUrl: string
  contentUrlExpiresAt: string
  createdDateTime: string
}

export interface AzureImageGeneration {
  id: string
  status: string
  result: AzureImageGenerationResult
}
