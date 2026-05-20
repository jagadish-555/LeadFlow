import { z } from 'zod'

const statusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Proposal_Sent', 'Won', 'Lost'])

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  status: statusEnum.optional().default('New'),
})

export const createDiscussionSchema = z.object({
  note: z.string({ error: 'Note is required' }).max(2000),
  followUpAt: z.preprocess(
    (val) => (val === '' ? null : val),
    z.iso.datetime().nullable().optional()
  ),
  status: statusEnum.optional(),
})

export const leadQuerySchema = z.object({
  status: statusEnum.optional(),
  search: z.string().optional(),
})

export const signupSchema = z.object({
  name: z.string({ error: 'Name is required' }).max(100),
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(8, { error: 'Password must be at least 8 characters' }).max(100),
})

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(8, { error: 'Password must be at least 8 characters' }).max(100),
})
