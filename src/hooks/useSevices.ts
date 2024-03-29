import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest
} from 'openai'
import {
  OPENAI_CHAT_COMPLETION_URL,
  OPENAI_IMAGE_GENERATION_URL,
  OPENAI_TEXT_COMPLETION_URL
} from 'src/shared/constants'
import { Companies, Products } from 'src/types/global'
import useSettings from './useSettings'

const useServices = () => {
  const { settings } = useSettings()

  const _fetch = <T>(url: string, body: T) => {
    const headers = {
      [Companies.Azure]: {
        'api-key': settings?.azureSecretKey || ''
      },
      [Companies.OpenAI]: {
        Authorization: `Bearer ${settings?.openaiSecretKey}`,
        'OpenAI-Organization': settings?.openaiOrganizationId || ''
      }
    }

    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers[settings?.company || Companies.OpenAI]
      },
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }

  const company = {
    [Companies.Azure]: {
      [Products.ChatCompletion]: (body: CreateChatCompletionRequest) =>
        _fetch(
          `${settings?.azureEndPoint}/openai/deployments/${settings?.azureDeploymentName}/chat/completions?api-version=2023-03-15-preview`,
          body
        ),
      [Products.TextCompletion]: (body: CreateCompletionRequest) =>
        _fetch(
          `${settings?.azureEndPoint}/openai/deployments/${settings?.azureDeploymentName}/completions?api-version=2022-12-01`,
          body
        ),
      [Products.ImageGeneration]: (body: CreateImageRequest) =>
        _fetch(
          `${settings?.azureEndPoint}/openai/images/generations:submit?api-version=2023-06-01-preview`,
          body
        )
    },
    [Companies.OpenAI]: {
      [Products.ChatCompletion]: (body: CreateChatCompletionRequest) =>
        _fetch(OPENAI_CHAT_COMPLETION_URL, body),
      [Products.TextCompletion]: (body: CreateCompletionRequest) =>
        _fetch(OPENAI_TEXT_COMPLETION_URL, body),
      [Products.ImageGeneration]: (body: CreateImageRequest) =>
        _fetch(OPENAI_IMAGE_GENERATION_URL, body)
    }
  }

  return company[settings?.company || Companies.OpenAI]
}

export default useServices
