import { createAnthropic } from '@ai-sdk/anthropic'
import { createAzure } from '@ai-sdk/azure'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createXai } from '@ai-sdk/xai'
import { createOllama } from 'ollama-ai-provider'
import { Setting } from '../db/schema'

export const openai = (setting: Setting) =>
  createOpenAI({
    apiKey: setting.openaiApiKey,
    baseURL: setting.openaiBaseUrl ?? 'https://api.openai.com/v1'
  })

export const azure = (setting: Setting) =>
  createAzure({
    apiKey: setting.azureOpenaiApiKey,
    baseURL: setting.azureOpenAiEndpoint,
    apiVersion: setting.azureOpenAiApiVersion
  })

export const anthropic = (setting: Setting) =>
  createAnthropic({
    apiKey: setting.anthropicApiKey,
    baseURL: setting.anthropicBaseUrl ?? 'https://api.anthropic.com/v1'
  })

export const googleGenerativeAI = (setting: Setting) =>
  createGoogleGenerativeAI({
    apiKey: setting.googleApiKey,
    baseURL:
      setting.anthropicBaseUrl ??
      'https://generativelanguage.googleapis.com/v1beta'
  })

export const xai = (setting: Setting) =>
  createXai({
    apiKey: setting.xAiApiKey,
    baseURL: setting.xAiBaseUrl ?? 'https://api.x.ai/v1'
  })

export const ollama = (setting: Setting) =>
  createOllama({
    baseURL: setting.ollamaBaseUrl ?? 'http://localhost:11434/api'
  })
