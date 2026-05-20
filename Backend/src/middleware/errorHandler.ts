import type { ErrorRequestHandler } from 'express'

type HttpError = {
  status?: number
  statusCode?: number
  expose?: boolean
  details?: unknown
  errors?: unknown
  issues?: unknown
}

const getStatusCode = (err: unknown): number => {
  if (typeof err === 'object' && err !== null) {
    const maybeError = err as HttpError
    const status = Number(maybeError.statusCode ?? maybeError.status)
    if (Number.isInteger(status) && status >= 400 && status <= 599) {
      return status
    }
  }

  return 500
}

const getMessage = (err: unknown): string => {
  if (err instanceof Error && err.message) {
    return err.message
  }

  if (typeof err === 'string') {
    return err
  }

  return 'Internal server error'
}

const getDetails = (err: unknown): unknown | undefined => {
  if (typeof err === 'object' && err !== null) {
    const maybeError = err as HttpError
    return maybeError.details ?? maybeError.errors ?? maybeError.issues
  }

  return undefined
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = getStatusCode(err)
  const exposeMessage = (err as HttpError)?.expose ?? statusCode < 500
  const details = getDetails(err)

  if (statusCode >= 500) {
    console.error('Unhandled error:', err)
  } else {
    console.warn('Request error:', err)
  }

  const payload: { error: { message: string; details?: unknown; stack?: string } } = {
    error: {
      message: exposeMessage ? getMessage(err) : 'Internal server error',
    },
  }

  if (details !== undefined) {
    payload.error.details = details
  }

  if (process.env.NODE_ENV !== 'production' && err instanceof Error) {
    payload.error.stack = err.stack
  }

  res.status(statusCode).json(payload)
}

export default errorHandler
export type { HttpError }
