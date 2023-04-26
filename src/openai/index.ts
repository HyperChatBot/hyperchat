import { Configuration, OpenAIApi } from 'openai'

class CustomFormData extends FormData {
  getHeaders() {
    return {}
  }
}

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  formDataCtor: CustomFormData
})

export const openai = new OpenAIApi(configuration)
