import { isAxiosError } from 'axios'
import { useState } from 'react'
import { openai } from 'src/openai'
import { OpenAIError } from 'src/types/global'

const useImage = () => {
  const [loading, setLoading] = useState(false)

  const createImage = async (prompt: string) => {
    setLoading(true)
    try {
      const res = await openai.createImage({ prompt })
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

  return { loading, createImage }
}

export default useImage
