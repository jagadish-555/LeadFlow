import { apiRequest } from './apiClient'

export type User = {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type LoginResponse = {
  token: string
  tokenType: string
  user: User
}

export type SignupResponse = {
  user: User
}

export const login = async (payload: { email: string; password: string }) => {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: {
      email: payload.email.trim(),
      password: payload.password,
    },
    errorMessage: 'Unable to sign in',
  })
}

export const signup = async (payload: { name: string; email: string; password: string }) => {
  return apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: {
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
    },
    errorMessage: 'Unable to sign up',
  })
}

export const getMe = async () => {
  return apiRequest<{ user: User }>('/auth/me', {
    auth: true,
    errorMessage: 'Unable to load profile',
  })
}
