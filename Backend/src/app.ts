import express from 'express'
import authRoutes from './routes/auth'
import errorHandler from './middleware/errorHandler'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.use(errorHandler)

export default app
