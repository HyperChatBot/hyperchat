import { Companies } from 'src/types/global'
import * as anthropic from './anthropic'
import * as google from './google'
import * as llama from './llama'
import * as openAI from './openAI'

const configurations = {
  [Companies.Anthropic]: anthropic,
  [Companies.Google]: google,
  [Companies.OpenAI]: openAI,
  [Companies.Llama]: llama
}

export default configurations
