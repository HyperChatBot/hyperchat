import { AzureKeyCredential, OpenAIClient } from '@azure/openai'
import { OpenAI } from 'openai'
import { useSettings } from 'src/hooks'

const useClients = () => {
  const { settings } = useSettings()

  const openAiClient = new OpenAI({
    apiKey: settings?.openaiSecretKey || '',
    organization: settings?.openaiOrganizationId,
    dangerouslyAllowBrowser: true
  })

  const azureClient = new OpenAIClient(
    settings?.azureEndPoint || '',
    new AzureKeyCredential(settings?.azureSecretKey || '')
  )

  return { openAiClient, azureClient }
}

export default useClients
