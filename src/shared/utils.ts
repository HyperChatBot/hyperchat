import { DateTime } from 'luxon'

export const formatDate = (millis: number) => {
  const now = DateTime.now()
  const date = DateTime.fromMillis(millis)

  if (now.hasSame(date, 'day')) {
    return { isSameDay: true, display: date.toFormat('T') }
  }

  return { isSameDay: false, display: date.toFormat('DDD') }
}
