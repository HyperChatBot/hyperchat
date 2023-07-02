export interface AzureImageGenerationData {
  url: string
}

export interface AzureImageGenerationResult {
  created: number
  data: AzureImageGenerationData[]
}

export interface AzureImageGeneration {
  id: string
  status: string
  created: number
  expires: number
  result: AzureImageGenerationResult
}
