import { Router } from 'express'
import { getMe, login, signup } from '../controllers/auth.controller'
import authenticate from '../middleware/authenticate'
import validateBody from '../middleware/validate'
import { loginSchema, signupSchema } from '../validators/schemas'

const router = Router()

router.post('/signup', validateBody(signupSchema), signup)
router.post('/login', validateBody(loginSchema), login)
router.get('/me', authenticate, getMe)

export default router
