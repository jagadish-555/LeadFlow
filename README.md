# LeadFlow

LeadFlow is a single-screen Customer Relationship Management (CRM) application designed specifically for sales professionals. It provides a lightweight yet powerful interface to efficiently track leads, log discussion histories, and manage follow-up schedules.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, TypeScript
*   **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, TypeScript

## Prerequisites

*   Node.js (v18 or higher recommended)
*   PostgreSQL (or a hosted PostgreSQL database URL)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/jagadish-555/LeadFlow.git
cd LeadFlow
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy the `.env.example` file to create a new `.env` file in the `Backend` directory.
    *   **`DATABASE_URL`**: Update with your PostgreSQL connection string.
    *   **`JWT_SECRET`**: Set to a secure random string.
    *   **`PORT`**: (Optional) Defaults to `3001`.
    *   **`CORS_ORIGIN`**: (Optional) Defaults to `http://localhost:5173`.
4.  Run database migrations to initialize the schema:
    ```bash
    npm run db:migrate
    ```
5.  (Optional but recommended) Seed the database with initial demo data:
    ```bash
    npm run db:seed
    ```
6.  Start the backend development server:
    ```bash
    npm run dev
    ```
    The backend server will start and typically listen on port `3001`.

### 3. Frontend Setup

1.  Open a new terminal window and navigate to the frontend directory from the project root:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy the `.env.example` file to create a new `.env` file in the `Frontend` directory.
    *   **`VITE_API_URL`**: Set this to your backend server URL (e.g., `http://localhost:3001`).
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173`.

## Available Scripts

### Backend (`/Backend`)
*   `npm run dev`: Starts the development server with live reload (`ts-node-dev`).
*   `npm run build`: Compiles TypeScript to JavaScript (`tsc`).
*   `npm start`: Runs the compiled production server.
*   `npm run db:migrate`: Applies Prisma migrations to your database.
*   `npm run db:seed`: Seeds the database with demo content.
*   `npm run format`: Formats code using Prettier.

### Frontend (`/Frontend`)
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Type-checks and builds the frontend for production.
