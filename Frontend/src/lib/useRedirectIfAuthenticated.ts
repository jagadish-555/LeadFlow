import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate()
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true })
    }
  }, [status, navigate])
}

export default useRedirectIfAuthenticated
