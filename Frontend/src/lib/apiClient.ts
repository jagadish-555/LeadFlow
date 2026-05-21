import { getToken } from './authStorage'

export const AUTH_UNAUTHORIZED_EVENT = 'leadflow:unauthorized'

export type ApiError = Error & {
  status?: number
}

type ApiErrorBody = {
  error?: {
    message?: string
  }
}

type ApiRequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
  errorMessage?: string
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(
  /\/$/,
  ''
)

const parseJson = async (response: Response) => {
  try {
    return (await response.json()) as unknown
  } catch (err) {
    return null
  }
}

const getErrorMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === 'object') {
    const body = data as ApiErrorBody
    if (typeof body.error?.message === 'string') {
      return body.error.message
    }
  }

  return fallback
}

const emitUnauthorizedEvent = () => {
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
}

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = false,
    errorMessage = 'Request failed',
  } = options

  const requestHeaders: Record<string, string> = { ...headers }

  if (body !== undefined && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await parseJson(response)

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, errorMessage)) as ApiError
    error.status = response.status

    if (response.status === 401 && auth) {
      emitUnauthorizedEvent()
    }

    throw error
  }

  return data as T
}
