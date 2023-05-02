import { WritableDraft } from 'immer/dist/internal'
import { DateTime } from 'luxon'
import { Conversation, Message } from 'src/types/conversation'
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

export const updateConversationState = (
  draft: WritableDraft<Conversation>,
  id: string,
  answer: string,
  stream?: boolean
) => {
  const messages = draft.messages
  const last = messages[messages.length - 1]

  const isFirstChuck = last.message_id === EMPTY_MESSAGE_ID
  if (isFirstChuck) {
    last.message_id = id
  }

  if (stream) {
    last.answer += answer
  } else {
    last.answer = answer
  }

  last.answer_created_at = +new Date()
}

export const updateMessageState = (
  draft: WritableDraft<Message>,
  id: string,
  answer: string,
  stream?: boolean
) => {
  const isFirstChuck = draft.message_id === EMPTY_MESSAGE_ID
  if (isFirstChuck) {
    draft.message_id = id
  }

  if (stream) {
    draft.answer += answer
  } else {
    draft.answer = answer
  }

  draft.answer_created_at = +new Date()
}
