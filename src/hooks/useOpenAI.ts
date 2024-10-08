import {  OpenAI } from 'openai'
import { useSettings } from 'src/hooks'

class CustomFormData extends FormData {
  getHeaders() {
    return {}
  }
}

const useOpenAI = () => {
  const { settings } = useSettings()

  const openai = new OpenAI({
    apiKey: settings?.openaiSecretKey,
    organization: settings?.openaiOrganizationId,
    dangerouslyAllowBrowser: true
  })

  return openai
}

export default useOpenAI
