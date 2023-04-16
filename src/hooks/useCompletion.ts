import {} from 'react'
import { openai } from 'src/openai'

const useCompletion = () => {
  const createCompletion = async (prompt: string) => {
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt
      })
      console.log(completion.data.choices[0].text)
    } catch (error: unknown) {
      if (error.response) {
        console.log(error.response.status) // 404
        console.log(error.response.data) // OpenAIError
      } else {
        console.log(error.message)
      }
    }
  }

  return { createCompletion }
}

export default useCompletion
