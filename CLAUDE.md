# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack address book application built with Next.js 14, TypeScript, Prisma, and SQLite. Features include user authentication, contact management, search/filtering, and CSV/vCard import/export capabilities.

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma generate

# Run development server
npm run dev

# Build for production
npm run build
```

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions and API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5 (credentials provider)
- **Deployment**: Docker with multi-stage builds

### Key Directories
- `/src/app` - Next.js App Router pages and layouts
  - `(auth)` - Public authentication pages (login, register)
  - `(dashboard)` - Protected dashboard and contact pages
  - `api` - API routes (NextAuth)
- `/src/actions` - Server Actions for data mutations
- `/src/components` - React components (UI, contacts, auth)
- `/src/lib` - Utilities, Prisma client, auth config
- `/prisma` - Database schema and migrations

### Security Considerations
- Passwords hashed with bcrypt (12 rounds)
- JWT sessions with httpOnly cookies
- Server-side input validation with Zod
- SQL injection prevention via Prisma
- File uploads limited to 5MB
- CSRF protection via NextAuth

### Database Schema
- **User**: Authentication and user data
- **Contact**: Contact information linked to users
- Row-level security via userId filtering
- Cascade deletes for data cleanup

## Development Workflow

### Adding New Features
1. Update Prisma schema if database changes needed
2. Run `npx prisma migrate dev`
3. Create/update server actions in `/src/actions`
4. Build UI components in `/src/components`
5. Create/update pages in `/src/app`
6. Test locally with `npm run dev`
7. Build to verify: `npm run build`

### Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change`
3. Prisma Client auto-regenerates

### Docker Deployment
```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Common Tasks

### Reset Database
```bash
rm prisma/dev.db
npx prisma migrate dev
```

### View Database
```bash
npx prisma studio
```

### Generate Secure Secret
```bash
openssl rand -base64 32
```

## Important Notes

- SQLite does not support case-insensitive search by default
- bcrypt is externalized in webpack config for Next.js compatibility
- File imports processed in-memory (no persistent storage)
- Database persisted via Docker volumes in production
