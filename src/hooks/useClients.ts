import { AzureKeyCredential, OpenAIClient } from '@azure/openai'
import * as azureSpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
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
    settings?.azureEndPoint || 'DEFAULT',
    new AzureKeyCredential(settings?.azureSecretKey || 'DEFAULT')
  )

  const speechConfig = azureSpeechSDK.SpeechConfig.fromSubscription(
    settings?.azureSpeechSecretKey || 'DEFAULT',
    settings?.azureSpeechRegion || 'DEFAULT'
  )
  const azureSpeechClient = new azureSpeechSDK.SpeechSynthesizer(speechConfig)

  return { openAiClient, azureClient, azureSpeechClient }
}

export default useClients
