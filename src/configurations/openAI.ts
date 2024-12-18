import { Configuration } from 'src/types/conversation'

export const models = [
  { modelName: 'gpt-4o', maxInput: 128000, maxOutput: 8192 },
  { modelName: 'gpt-4o-mini', maxInput: 128000, maxOutput: 8192 },
  { modelName: 'gpt-4-turbo', maxInput: 128000, maxOutput: 4096 },
  { modelName: 'gpt-4', maxInput: 8192, maxOutput: 8192 },
  { modelName: 'gpt-3.5-turbo', maxInput: 16385, maxOutput: 4096 }
]

export const configuration: Configuration = {
  model: 'gpt-4o',
  systemMessage: 'You are an AI assistant that helps people find information.',
  maxResponse: 8192,
  temperature: 1,
  topP: 0.95,
  stop: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemMessageTokensCount: 11
}
