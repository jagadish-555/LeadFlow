import type { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import prisma from '../db/prisma'

type JwtPayload = {
  userId: number
  email: string
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

const getJwtExpiresIn = (): SignOptions['expiresIn'] => {
  const expiresIn = process.env.JWT_EXPIRES_IN
  return (expiresIn ?? '7d') as SignOptions['expiresIn']
}

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, requireJwtSecret(), { expiresIn: getJwtExpiresIn() })
}

export const signup: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string }
  const normalizedEmail = normalizeEmail(email)

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  })

  if (existingUser) {
    return res.status(409).json({
      error: {
        message: 'Email is already registered',
      },
    })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return res.status(201).json({ user })
}

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email: string; password: string }
  const normalizedEmail = normalizeEmail(email)

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (!user) {
    return res.status(401).json({
      error: {
        message: 'Invalid email or password',
      },
    })
  }

  const matches = await bcrypt.compare(password, user.passwordHash)

  if (!matches) {
    return res.status(401).json({
      error: {
        message: 'Invalid email or password',
      },
    })
  }

  const token = signToken({ userId: user.id, email: user.email })

  return res.json({
    token,
    tokenType: 'Bearer',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
}

export const getMe: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: 'Unauthorized',
      },
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return res.status(404).json({
      error: {
        message: 'User not found',
      },
    })
  }

  return res.json({ user })
}
