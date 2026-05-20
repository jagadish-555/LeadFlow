import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import leadsRouter from './routes/leads'
import discussionsRouter from './routes/discussions'
import authmiddleware from './middleware/authenticate'
import errorHandler from './middleware/errorHandler'

const app = express()

const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin, credentials: true }))

app.use(express.json())

app.use('/auth', authRoutes)

app.use('/api/leads', authmiddleware, leadsRouter)

app.use('/api/leads/:id/discussions', authmiddleware, discussionsRouter)

app.use(errorHandler)

export default app
