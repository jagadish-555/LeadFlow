import {
  formatDistanceToNowStrict,
  format,
  isToday as dfIsToday,
  isPast,
  parseISO,
} from 'date-fns'

const toDate = (value: string | Date): Date =>
  value instanceof Date ? value : parseISO(value as string)

export const formatRelativeTime = (value: string | Date): string => {
  const date = toDate(value)
  return formatDistanceToNowStrict(date, { addSuffix: true })
}

export const isOverdue = (value: string | Date): boolean => {
  return isPast(toDate(value))
}

export const isToday = (value: string | Date): boolean => {
  return dfIsToday(toDate(value))
}

export const formatFollowUpLabel = (value: string | Date): string => {
  const date = toDate(value)
  const time = format(date, 'h:mm a')

  if (dfIsToday(date)) {
    return `Follow-up today at ${time}`
  }

  const dateLabel = format(date, 'MMM d')
  return `Follow-up on ${dateLabel} at ${time}`
}

export const formatDiscussionDate = (
  value: string | Date,
): { formatted: string; relative: string } => {
  const date = toDate(value)
  return {
    formatted: format(date, 'MMM d, h:mm a'),
    relative: formatDistanceToNowStrict(date, { addSuffix: true }),
  }
}

export const formatFollowUpDisplay = (value: string | Date): string => {
  return format(toDate(value), 'MMM d, h:mm a')
}
