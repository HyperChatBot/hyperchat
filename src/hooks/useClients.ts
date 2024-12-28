import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { OpenAI } from 'openai'
import { useSettings } from 'src/hooks'

const useClients = () => {
  const { settings } = useSettings()

  const openAiClient = new OpenAI({
    apiKey: settings?.openaiSecretKey || '',
    organization: settings?.openaiOrganizationId,
    dangerouslyAllowBrowser: true
  })

  const googleClient = new GoogleGenerativeAI(
    settings?.googleSecretKey || 'DEFAULT'
  )

  const anthropicClient = new Anthropic({
    apiKey: settings?.anthropicSecretKey || 'DEFAULT',
    dangerouslyAllowBrowser: true
  })

  return {
    openAiClient,
    googleClient,
    anthropicClient
  }
}

export default useClients
