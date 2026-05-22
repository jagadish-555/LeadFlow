import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../src/db/prisma'

async function seed() {
  console.log('Seeding database...')


  const passwordHash = await bcrypt.hash('password123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@leadflow.dev' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@leadflow.dev',
      passwordHash,
    },
  })
  console.log(`  Upserted user: ${demoUser.email}  (password: password123)`)

  const userId = demoUser.id


  const deleted = await prisma.lead.deleteMany({ where: { userId } })
  console.log(`  Deleted ${deleted.count} existing lead(s) for demo user`)

  const now = new Date()
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
  const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000)

  const lead1 = await prisma.lead.create({
    data: {
      name: 'Rahul Sharma',
      company: 'TechNova Solutions',
      phone: '9876543210',
      status: 'Contacted',
      followUpAt: hoursFromNow(3),
      createdAt: daysAgo(5),
      userId,
      discussions: {
        create: [
          {
            note: 'Initial cold call. Rahul showed interest in our enterprise plan.',
            createdAt: daysAgo(5),
          },
          {
            note: 'Sent product brochure and pricing over email. He said he will review by Monday.',
            followUpAt: daysAgo(2),
            createdAt: daysAgo(3),
          },
          {
            note: 'Quick follow-up call. He liked the pricing, wants a demo for his team.',
            followUpAt: hoursFromNow(3),
            createdAt: hoursAgo(6),
          },
        ],
      },
    },
  })
  console.log(`  Created lead: ${lead1.name}`)

  const lead2 = await prisma.lead.create({
    data: {
      name: 'Priya Patel',
      company: 'GreenLeaf Organics',
      phone: '8765432109',
      status: 'Qualified',
      followUpAt: daysAgo(1),
      createdAt: daysAgo(10),
      userId,
      discussions: {
        create: [
          {
            note: 'Met at the Bangalore startup expo. Very interested in our analytics dashboard.',
            createdAt: daysAgo(10),
          },
          {
            note: 'Had a 30-min product demo over Zoom. She wants to loop in her CTO.',
            followUpAt: daysAgo(3),
            createdAt: daysAgo(7),
          },
          {
            note: 'CTO call went well. They need a proposal with custom integrations.',
            followUpAt: daysAgo(1),
            createdAt: daysAgo(3),
          },
        ],
      },
    },
  })
  console.log(`  Created lead: ${lead2.name}`)

  const lead3 = await prisma.lead.create({
    data: {
      name: 'Amit Verma',
      company: 'CloudBridge IT',
      phone: '7654321098',
      status: 'New',
      createdAt: hoursAgo(2),
      userId,
    },
  })
  console.log(`  Created lead: ${lead3.name}`)

  const lead4 = await prisma.lead.create({
    data: {
      name: 'Sneha Reddy',
      company: 'FinEdge Capital',
      phone: '6543210987',
      status: 'Proposal_Sent',
      followUpAt: hoursFromNow(1),
      createdAt: daysAgo(14),
      userId,
      discussions: {
        create: [
          {
            note: 'Inbound lead from website contact form. Needs a CRM solution.',
            createdAt: daysAgo(14),
          },
          {
            note: 'Discovery call — 15 sales reps, currently using spreadsheets.',
            followUpAt: daysAgo(7),
            createdAt: daysAgo(12),
          },
          {
            note: 'Sent detailed proposal with ROI projections.',
            followUpAt: hoursFromNow(1),
            createdAt: daysAgo(2),
          },
        ],
      },
    },
  })
  console.log(`  Created lead: ${lead4.name}`)

  const lead5 = await prisma.lead.create({
    data: {
      name: 'Vikram Joshi',
      company: 'MediaPulse Agency',
      phone: '5432109876',
      status: 'Won',
      createdAt: daysAgo(30),
      userId,
      discussions: {
        create: [
          {
            note: 'Referral from existing client. Already familiar with our product.',
            createdAt: daysAgo(30),
          },
          {
            note: 'Signed 1-year contract. Onboarding starts next week.',
            createdAt: daysAgo(7),
          },
        ],
      },
    },
  })
  console.log(`  Created lead: ${lead5.name}`)

  const lead6 = await prisma.lead.create({
    data: {
      name: 'Kavitha Nair',
      company: 'UrbanNest Realty',
      phone: '4321098765',
      status: 'Lost',
      createdAt: daysAgo(20),
      userId,
      discussions: {
        create: [
          {
            note: 'Cold outreach via LinkedIn. Showed mild interest.',
            createdAt: daysAgo(20),
          },
          {
            note: 'Demo scheduled but she no-showed twice.',
            followUpAt: daysAgo(10),
            createdAt: daysAgo(15),
          },
          {
            note: 'Went with a competitor. Cited lower pricing as the reason.',
            createdAt: daysAgo(8),
          },
        ],
      },
    },
  })
  console.log(`  Created lead: ${lead6.name}`)

  console.log('\nSeeding complete!')
  console.log('  Demo / Guest login  → email: demo@leadflow.dev  |  password: password123')
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
