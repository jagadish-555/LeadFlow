# LeadFlow

LeadFlow is a single-screen CRM (Customer Relationship Management) application built for sales professionals. It provides a lightweight yet powerful interface to track leads, log discussion histories, and manage follow-up schedules — all from a single view.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS        |
| Backend    | Node.js, Express 5, TypeScript, Prisma ORM      |
| Database   | PostgreSQL                                      |
| Auth       | JWT (JSON Web Tokens) + bcrypt                  |
| Validation | Zod                                             |

---

## Features

-  JWT-based authentication (register / login / logout)
-  Create, view, and filter leads by status
-  Per-lead discussion timeline with notes and follow-up scheduling
-  Lead statuses: `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`
-  Demo account pre-loaded with sample data to explore the app instantly

---

## Folder Structure

```
LeadFlow/
├── Backend/
│   ├── prisma/
│   │   ├── migrations/         # Prisma migration history
│   │   ├── schema.prisma       # Database schema (User, Lead, Discussion)
│   │   └── seed.ts             # Seeds guest user with sample leads
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── leads.controller.ts
│   │   │   └── discussions.controller.ts
│   │   ├── db/
│   │   │   └── prisma.ts       # Prisma client singleton
│   │   ├── generated/
│   │   │   └── prisma/         # Auto-generated Prisma client (do not edit)
│   │   ├── middleware/
│   │   │   ├── authenticate.ts # JWT verification middleware
│   │   │   ├── errorHandler.ts # Global error handler
│   │   │   └── validate.ts     # Zod request validation middleware
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /auth/register, /auth/login
│   │   │   ├── leads.ts        # CRUD /api/leads
│   │   │   └── discussions.ts  # CRUD /api/leads/:id/discussions
│   │   ├── types/              # Shared TypeScript types
│   │   ├── validators/
│   │   │   └── schemas.ts      # Zod validation schemas
│   │   ├── app.ts              # Express app setup (routes, CORS, middleware)
│   │   └── index.ts            # Server entry point (DB connect + listen)
│   ├── .env.example            # Environment variable template
│   ├── .prettierrc
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── Frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── leads/
│   │   │   │   ├── AddLeadModal.tsx
│   │   │   │   ├── FilterPills.tsx
│   │   │   │   ├── LeadCard.tsx
│   │   │   │   ├── LeadTimelineModal.tsx
│   │   │   │   ├── ModalShell.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── AppLogo.tsx
│   │   │   ├── Icons.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Auth state (user, token, login/logout)
│   │   ├── lib/
│   │   │   ├── apiClient.ts     # fetch base client with auth headers
│   │   │   ├── authApi.ts       # Auth API calls (login, register)
│   │   │   ├── authStorage.ts   # Token persistence (localStorage)
│   │   │   ├── date.ts          # Date formatting helpers
│   │   │   ├── leadsApi.ts      # Leads & discussions API calls
│   │   │   └── useRedirectIfAuthenticated.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Main CRM dashboard (single-screen)
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── assets/
│   │   ├── App.tsx              # Router + route definitions
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── LICENSE
└── README.md
```

---

## API Routes

### Auth — `/auth`
| Method | Endpoint          | Description              | 
|--------|-------------------|--------------------------|
| POST   | `/auth/signup`    | Register a new user      | 
| POST   | `/auth/login`     | Login and receive a JWT  | 
| GET    | `/auth/me`        | Get current user details |

### Leads — `/api/leads`
| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| GET    | `/api/leads`                | List all leads (own user)       | 
| GET    | `/api/leads/:id`            | Get a single lead by ID         |
| GET    | `/api/leads/follow-ups/today` | List today's follow-ups       |
| POST   | `/api/leads`                | Create a new lead               |

### Discussions — `/api/leads/:id/discussions`
| Method | Endpoint                               | Description              | 
|--------|----------------------------------------|--------------------------|
| POST   | `/api/leads/:id/discussions`           | Add a discussion note    |

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- PostgreSQL (local or hosted)

### 1. Clone the repository

```bash
git clone https://github.com/jagadish-555/LeadFlow.git
cd LeadFlow
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET at minimum
```

**`.env` variables:**

| Variable           | Required | Default                 | Description                              |
|--------------------|----------|-------------------------|------------------------------------------|
| `PORT`             | No       | `3001`                  | Port the backend listens on              |
| `NODE_ENV`         | No       | `development`           | `development` or `production`            |
| `DATABASE_URL`     | Yes   | —                       | PostgreSQL connection string             |
| `JWT_SECRET`       | Yes   | —                       | Secret key for signing JWTs             |
| `JWT_EXPIRES_IN`   | No       | `7d`                    | JWT expiry duration                      |
| `CORS_ORIGIN`      | No       | `http://localhost:5173` | Allowed frontend origin                  |
| `DISABLE_SSL`      | No       | `true`                  | Set `false` for hosted/production DBs    |
| `DATABASE_CA_CERT` | No       | —                       | CA certificate for SSL DB connections    |

```bash
# Apply database migrations
npm run db:migrate

# Seed the database (REQUIRED for Frontend Guest Login)
npm run seed

# Start the development server (http://localhost:3001)
npm run dev
```

### 3. Frontend Setup

```bash
# In a new terminal, from the project root:
cd Frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001

# Start the development server (http://localhost:5173)
npm run dev
```

---

## Available Scripts

### Backend (`/Backend`)

| Script              | Command                                                               | Description                                            |
|---------------------|-----------------------------------------------------------------------|--------------------------------------------------------|
| `npm run dev`       | `ts-node-dev --files src/index.ts`                                   | Development server with hot reload                     |
| `npm run build`     | `tsc`                                                                 | Compile TypeScript to JavaScript                       |
| `npm run build:prod`| `npx prisma migrate deploy && npx prisma generate && npx tsx prisma/seed.ts && npx tsc` | Full production build (migrate + generate + seed + compile) |
| `npm run start`     | `node dist/index.js`                                                  | Run the compiled production server                     |
| `npm run seed`      | `npx tsx prisma/seed.ts`                                              | Seed demo user with sample data                        |
| `npm run db:migrate`| `prisma migrate dev`                                                  | Apply migrations in development                        |
| `npm run db:seed`   | `ts-node-dev prisma/seed.ts`                                          | Seed using ts-node-dev (dev only)                      |
| `npm run db:studio` | `prisma studio`                                                       | Open Prisma Studio (DB GUI)                            |
| `npm run format`    | `prettier --write src`                                                | Format source files with Prettier                      |

### Frontend (`/Frontend`)

| Script            | Command               | Description                           |
|-------------------|-----------------------|---------------------------------------|
| `npm run dev`     | `vite`                | Start Vite development server         |
| `npm run build`   | `tsc -b && vite build`| Type-check and build for production   |
| `npm run preview` | `vite preview`        | Preview the production build locally  |

---

## Demo Accounts

The seed script (`npm run seed`) automatically creates the demo account used for the "Guest Login" feature in the frontend.

| Account      | Email                  | Password     | Description                          |
|--------------|------------------------|--------------|--------------------------------------|
| Demo  | `demo@leadflow.dev`    | `password123`| Pre-loaded with 6 sample leads       |

> [!WARNING]
> **Seeding is Mandatory for Guest Login**: If you do not run the seed script (`npm run seed`), the "Guest Login" button on the frontend will fail because the `demo@leadflow.dev` user won't exist in your database. 
> 
> The seed is **idempotent** — safe to run on every deploy. It uses `upsert` so re-running will not create duplicate accounts.

---

## Deploying to Render

### Backend (Web Service)

| Setting           | Value                                                                           |
|-------------------|---------------------------------------------------------------------------------|
| Root Directory    | `Backend`                                                                       |
| Build Command     | `npm install && npm run build:prod`                                             |
| Start Command     | `npm run start`                                                                 |

Add all required environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`, `DISABLE_SSL=false`) in the **Environment** tab.

### Frontend (Static Site)

| Setting           | Value              |
|-------------------|--------------------|
| Root Directory    | `Frontend`         |
| Build Command     | `npm install && npm run build` |
| Publish Directory | `dist`             |

Add `VITE_API_URL` pointing to your deployed backend URL (e.g. `https://leadflow-api.onrender.com`).

---

## License

[MIT](./LICENSE)
