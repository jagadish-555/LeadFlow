import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = () => {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div
      className="min-h-screen bg-slate-50 flex items-center justify-center gap-3 text-sm text-slate-500"
        role="status"
        aria-live="polite"
      >
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600"
          aria-hidden="true"
        />
        <span>Checking session...</span>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute
