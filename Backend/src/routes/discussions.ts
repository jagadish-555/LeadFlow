import { Router } from 'express'
import { createDiscussion } from '../controllers/discussions.controller'
import validateBody from '../middleware/validate'
import { createDiscussionSchema } from '../validators/schemas'

const router = Router({ mergeParams: true })

router.post('/', validateBody(createDiscussionSchema), createDiscussion)

export default router
