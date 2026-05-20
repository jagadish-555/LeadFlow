import type { RequestHandler } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

type AuthTokenPayload = JwtPayload & {
  userId?: number
  email?: string
}

const requireJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    const err = new Error('JWT_SECRET is not configured') as Error & { statusCode?: number }
    err.statusCode = 500
    throw err
  }

  return secret
}

const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

const authMiddleware: RequestHandler = (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization)

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Authorization token is missing',
      },
    })
  }

  try {
    const decoded = jwt.verify(token, requireJwtSecret())
    const payload = decoded as AuthTokenPayload

    if (!payload.userId || !payload.email) {
      return res.status(401).json({
        error: {
          message: 'Invalid token payload',
        },
      })
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
    }

    return next()
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode

    if (statusCode) {
      return next(err)
    }

    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
      },
    })
  }
}

export default authMiddleware
