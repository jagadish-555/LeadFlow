import { Router } from 'express'
import {
  getLeads,
  getLeadById,
  createLead,
  getTodayFollowUps,
} from '../controllers/leads.controller'
import validateBody from '../middleware/validate'
import { createLeadSchema } from '../validators/schemas'

const router = Router()

router.get('/follow-ups/today', getTodayFollowUps)
router.get('/', getLeads)
router.get('/:id', getLeadById)
router.post('/', validateBody(createLeadSchema), createLead)

export default router
