# Employee Management System (EMS)

A three-layer web app for Digital Brains: Next.js frontend, Express.js API, Prisma ORM, MySQL database, JWT authentication.

## Architecture

```
Presentation Layer   → frontend/   (Next.js pages, components, API calls)
Business Logic Layer → backend/src/controllers + services (validation, rules)
Data Access Layer     → backend/prisma/schema.prisma + backend/src/config/db.js
```

Request flow: `Next.js page → axios call → Express route → middleware (auth/validation) → controller → service (business rules) → Prisma → MySQL`.

## What's implemented

- JWT login (`/login`) with token stored client-side, attached to every API call
- Dashboard with batch stats and recent batches table
- Batches: list (search/filter/pagination), create, detail view (with internees in that batch)
- Internees: list (search/pagination), create (two-step form: Personal Info → Tenure Info, which creates the internee then links them to a batch via a tenure record — covering "Create Internee-Tenure" and "Create Internee-Tenure/batch")
- Assets: list + inline create form, assign to internee, mark as returned.
- Full CRUD REST API for batches, internees, tenures, assets
- Centralized error handling, input validation, Prisma error translation (duplicate/foreign-key errors → clean HTTP responses)

## What is NOT included (be aware before treating this as production)

- Automated tests (unit/integration/e2e)
- Refresh tokens / token revocation — the JWT is a single long-lived token
- Rate limiting on auth endpoints (brute-force protection)
- File uploads for CV/profile picture/certificates (the Figma mockups show these; the schema and forms don't currently store files — add an upload endpoint + storage, e.g. S3, before relying on this)
- Deployment configs (Docker, CI/CD)
- Fine-grained role-based permissions beyond ADMIN/HR distinction in the schema

## Prerequisites

- Node.js 18+
- A running MySQL server (local or hosted)

## 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL to your MySQL connection string, and set a real JWT_SECRET

npm install
npx prisma migrate dev --name init   # creates tables in MySQL
npm run seed                         # creates admin@digitalbrains.com / Admin@123 + a sample batch
npm run dev                          # starts on http://localhost:5000
```

## 2. Frontend setup

```bash
cd frontend
cp .env.local.example .env.local
# defaults to http://localhost:5000/api, change if your backend runs elsewhere

npm install
npm run dev                          # starts on http://localhost:3000
```

## 3. Log in

Open http://localhost:3000 → redirects to `/login`.

Default seeded credentials:
- Email: `admin@digitalbrains.com`
- Password: `Admin@123`

**Change this password (or delete/re-seed with your own) before using this anywhere real.**

## API endpoints

All routes except `/api/auth/login` and `/api/auth/register` require `Authorization: Bearer <token>`.

| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/register | Create a login user |
| POST | /api/auth/login | Get a JWT |
| GET  | /api/auth/me | Current user profile |
| GET/POST | /api/batches | List / create batches |
| GET/PUT/DELETE | /api/batches/:id | Read / update / delete a batch |
| GET/POST | /api/internees | List / create internees |
| GET/PUT/DELETE | /api/internees/:id | Read / update / delete an internee |
| GET/POST | /api/tenures | List / create tenures (link internee ↔ batch) |
| GET/PUT/DELETE | /api/tenures/:id | Read / update / delete a tenure |
| GET/POST | /api/assets | List / create assets |
| PATCH | /api/assets/:id/return | Mark an asset returned/unassigned |
| GET/PUT/DELETE | /api/assets/:id | Read / update / delete an asset |

Query params on list endpoints: `search`, `status`, `page`, `limit` (batches/internees/assets), plus `batchId` on internees/tenures.

## Design reference

Built from the screenshots in `Digital_Brains_Web.docx` (dark theme, green/blue brand colors, sidebar nav, table + form layouts). This was not pulled live from the linked Figma file — I don't have browser access to Figma — so treat the visual match as "close, same structure and field names" rather than pixel-exact.
