import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ApiError } from '../lib/apiClient'
import { AUTH_UNAUTHORIZED_EVENT } from '../lib/apiClient'
import type { LoginResponse, User } from '../lib/authApi'
import { getMe, login, signup } from '../lib/authApi'
import { clearToken, getToken, setToken } from '../lib/authStorage'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  status: AuthStatus
  user: User | null
  signIn: (payload: { email: string; password: string }) => Promise<LoginResponse>
  signUp: (payload: { name: string; email: string; password: string }) => Promise<LoginResponse>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  const handleUnauthorized = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const bootstrap = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setStatus('unauthenticated')
      return
    }

    try {
      const response = await getMe()
      setUser(response.user)
      setStatus('authenticated')
    } catch (err) {
      const error = err as ApiError
      if (error?.status === 401) {
        clearToken()
      }
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [handleUnauthorized])

  const signIn = useCallback(async (payload: { email: string; password: string }) => {
    const response = await login(payload)
    setToken(response.token)
    setUser(response.user)
    setStatus('authenticated')
    return response
  }, [])

  const signUp = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      await signup(payload)
      return signIn({ email: payload.email, password: payload.password })
    },
    [signIn]
  )

  const signOut = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(
    () => ({
      status,
      user,
      signIn,
      signUp,
      signOut,
    }),
    [status, user, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
