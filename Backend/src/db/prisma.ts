import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const poolConfig: PoolConfig = { connectionString }

if (process.env.DISABLE_SSL !== 'true') {
  const rawCert = process.env.DATABASE_CA_CERT

  if (!rawCert) {
    throw new Error(
      'DATABASE_CA_CERT environment variable is not set. ' +
        'Set DISABLE_SSL=true in your .env for local development without SSL.'
    )
  }

  const formattedCert = rawCert.replace(/\\n/g, '\n')

  poolConfig.ssl = {
    ca: formattedCert,
    rejectUnauthorized: true,
  }
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
