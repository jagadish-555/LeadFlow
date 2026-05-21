import { Request, Response, NextFunction } from 'express'
import prisma from '../db/prisma'

// POST /api/leads/:id/discussions
export const createDiscussion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leadId = Number(req.params.id)

    if (isNaN(leadId)) {
      res.status(400).json({ error: 'Invalid lead ID' })
      return
    }

    const userId = req.user!.id

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, userId: true },
    })

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }

    if (lead.userId !== userId) {
      res.status(403).json({ error: 'You do not have access to this lead' })
      return
    }

    const { note, followUpAt, status } = req.body

    const [discussion, updatedLead] = await prisma.$transaction([
      prisma.discussion.create({
        data: {
          note,
          followUpAt: followUpAt ?? null,
          leadId,
        },
      }),
      prisma.lead.update({
        where: { id: leadId },
        data: {
          updatedAt: new Date(),
          ...(status && { status }),
          ...(followUpAt !== undefined ? { followUpAt: followUpAt ?? null } : {}),
        },
        include: {
          discussions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
    ])

    res.status(201).json({ discussion, lead: updatedLead })
  } catch (err) {
    next(err)
  }
}
