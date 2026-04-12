# kelasISO - Agent Notes

## Project Overview
Full-stack Learning Management System for Indonesian workers to learn ISO Standards.

## Tech Stack
- Next.js 14 with TypeScript
- Tailwind CSS 3.x
- Prisma 5.x with SQLite (dev.db)
- NextAuth v5 (beta)
- bcryptjs for password hashing

## Key Files
- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client
- `src/app/api/auth/[...nextauth]/options.ts` - NextAuth config
- `src/types/next-auth.d.ts` - TypeScript types for NextAuth

## Getting Started
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run seed script
npm run seed

# Development
npm run dev

# Production build
npm run build
npm start
```

## Test Accounts
- Admin: admin@iso-lms.com / admin123
- Student: student@demo.com / demo123

## Notes
- NextAuth v5 uses `auth()` function instead of `getServerSession()`
- Tailwind CSS 3.x required (not v4)
- Prisma 5.x required (not v7)
- Indonesian language (Bahasa Indonesia) for UI