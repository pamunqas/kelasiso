# kelasISO

Platform pembelajaran Learning Management System untuk mempelajari standar ISO.

## Requirements

- Node.js 18+
- npm atau yarn
- SQLite (terincluded)

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd kelasiso
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env.local
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Setup database:
```bash
# Create database dan apply schema
npx prisma db push

# Run seed untuk data awal (opsional)
npm run seed
```

6. Jalankan development server:
```bash
npm run dev
```

7. Buka http://localhost:3000

## Akun Default

Setelah running seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@iso-lms.com | admin123 |
| Student | student@demo.com | demo123 |

## Tech Stack

- Next.js 14 with TypeScript
- Tailwind CSS 3.x
- Prisma 5.x with SQLite
- NextAuth v5 (beta)
- bcryptjs

## Project Structure

```
src/
├── app/               # Next.js App Router
│   ├── admin/         # Admin pages (CRUD users, courses)
│   ├── api/           # API routes
│   ├── dashboard/     # Student dashboard
│   ├── courses/       # Course listing & learning
│   └── certificates/  # User certificates
├── components/       # React components
├── lib/               # Utilities (prisma client)
└── types/             # TypeScript definitions
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with sample data
npm run lint     # Run linting
```

## Environment Variables

Buat `.env.local` dengan:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opsional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Fitur

- ✅ Login/Register (credentials & Google)
- ✅ Dashboard student dengan enrollments & certificates
- ✅ Course enrollment dan progress tracking
- ✅ Lesson completion
- ✅ Quiz dengan score requirement 70%
- ✅ Certificate generation saat 100% progress
- ✅ Admin dashboard dengan UserNav (tanpa menu student)
- ✅ Admin CRUD: users, courses, modules, lessons
- ✅ Session protection (admin untuk admin, dashboard untuk student)
- ✅ Middleware untuk route protection