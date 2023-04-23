import { isAxiosError } from 'axios'
import { useState } from 'react'
import { openai } from 'src/openai'
import { OpenAIError } from 'src/types/global'

const useAudio = () => {
  const [loading, setLoading] = useState(false)

  const createTranscription = async (file: File, prompt?: string) => {
    setLoading(true)
    try {
      const res = await openai.createTranscription(file, '', prompt)
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        console.log(error.response?.status) // Eg: 404
        console.log(error.response?.data) //  OpenAIError
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const createTranslation = async (file: File, prompt?: string) => {
    setLoading(true)
    try {
      const res = await openai.createTranslation(file, '', prompt)
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        console.log(error.response?.status) // Eg: 404
        console.log(error.response?.data) //  OpenAIError
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, createTranscription, createTranslation }
}

export default useAudio
