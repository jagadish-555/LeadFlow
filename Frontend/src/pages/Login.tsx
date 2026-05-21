import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useRedirectIfAuthenticated from '../lib/useRedirectIfAuthenticated'
import AppLogo from '../components/AppLogo'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  useRedirectIfAuthenticated()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await signIn({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      await signIn({ email: 'demo@leadflow.dev', password: 'password123' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in as guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card sm:p-10">
        <AppLogo />
        <h1 className="mt-5 text-[28px] font-semibold text-slate-900">Welcome back</h1>
        <p className="mb-7 mt-1 text-sm text-slate-500">Sign in to your account</p>

        <form className="space-y-4 text-left" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-[13px] font-medium text-slate-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[13px] font-medium text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 pr-20 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword((value) => !value)}
                aria-pressed={showPassword}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error ? (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                aria-hidden="true"
              />
            ) : null}
            <span>{loading ? 'Signing in' : 'Sign in'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Guest login */}
        <button
          type="button"
          id="guest-login"
          onClick={handleGuestLogin}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/60 border-t-slate-600"
              aria-hidden="true"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
          <span>Continue as Guest</span>
        </button>

        <p className="mt-5 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-blue-600" to="/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
