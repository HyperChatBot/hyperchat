import { DateTime } from 'luxon'
import { ErrorType } from 'src/types/global'
import { EMPTY_MESSAGE_ID } from './constants'

export const formatDate = (millis: number) => {
  const now = DateTime.now()
  const date = DateTime.fromMillis(millis)

  if (now.hasSame(date, 'day')) {
    return {
      isSameDay: true,
      display: date.toLocaleString(DateTime.TIME_24_SIMPLE)
    }
  }

  return { isSameDay: false, display: date.toLocaleString(DateTime.DATE_FULL) }
}

export const generateErrorMessage = (type: ErrorType, message: string) =>
  type + message

export const generateEmptyMessage = (question: string) => ({
  message_id: EMPTY_MESSAGE_ID,
  answer: '',
  question,
  question_created_at: +new Date(),
  answer_created_at: +new Date()
})
