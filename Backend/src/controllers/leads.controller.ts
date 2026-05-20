import { Request, Response, NextFunction } from 'express'
import { endOfDay, startOfDay } from 'date-fns'
import prisma from '../db/prisma'
import { leadQuerySchema } from '../validators/schemas'

// GET /api/leads?status=New&search=john
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = leadQuerySchema.safeParse(req.query)
    if (!query.success) {
      res.status(400).json({ error: 'Invalid query params' })
      return
    }

    const { status, search } = query.data

    const leads = await prisma.lead.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        discussions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json(leads)
  } catch (err) {
    next(err)
  }
}

// GET /api/leads/:id
export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid lead ID' })
      return
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        discussions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }

    res.json(lead)
  } catch (err) {
    next(err)
  }
}

// POST /api/leads
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, company, phone, status } = req.body

    const lead = await prisma.lead.create({
      data: { name, company, phone, status },
      include: {
        discussions: true,
      },
    })

    res.status(201).json(lead)
  } catch (err) {
    next(err)
  }
}

// GET /api/leads/follow-ups/today
export const getTodayFollowUps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date()
    const startOfTodayUtc = startOfDay(now)
    const endOfTodayUtc = endOfDay(now)

    const leads = await prisma.lead.findMany({
      where: {
        followUpAt: {
          gte: startOfTodayUtc,
          lte: endOfTodayUtc,
        },
      },
      include: {
        discussions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { followUpAt: 'asc' },
    })

    res.json(leads)
  } catch (err) {
    next(err)
  }
}
