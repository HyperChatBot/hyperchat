import { OpenAI } from 'openai'
import { useSettings } from 'src/hooks'

const useOpenAI = () => {
  const { settings } = useSettings()

  const openai = new OpenAI({
    apiKey: settings?.openaiSecretKey || '',
    organization: settings?.openaiOrganizationId,
    dangerouslyAllowBrowser: true
  })

  return openai
}

export default useOpenAI
