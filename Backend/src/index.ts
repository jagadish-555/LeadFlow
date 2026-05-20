import 'dotenv/config'
import app from './app'
import prisma from './db/prisma'

const PORT = Number(process.env.PORT) || 3001

async function main() {
  await prisma.$connect()
  console.log('Connected to the database successfully.')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

main().catch(async (err) => {
  console.error('Failed to start server:', err)
  await prisma.$disconnect()
  process.exit(1)
})
