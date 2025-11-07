# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Git Bash (for Windows users)

## Setup

### 1. Install Dependencies

```

npm install

```

### 2. Environment Variables

Create `.env.local`:

```

cp .env.example .env.local

```

Add your credentials:

```


# Supabase

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT

JWT_SECRET=your_super_secret_key_min_32_chars

```

### 3. Database Setup

Run the SQL from `NEXT_STEPS.md` in your Supabase SQL editor.

### 4. Start Development Server

```

npm run dev

```

Visit `http://localhost:3000`

## Quick Test

1. Go to `/auth/register`
2. Create an account
3. Login
4. Check dashboard

## Available Scripts

```


# Development

npm run dev          \# Start dev server with Turbopack
npm run build        \# Build for production
npm start            \# Start production server

# Code Quality

npm run typecheck    \# TypeScript type checking
npm run lint         \# ESLint
npm run lint:fix     \# Fix ESLint issues

# Testing (when implemented)

npm test             \# Run tests
npm test:watch       \# Watch mode
npm test:coverage    \# Coverage report

```

## Troubleshooting

### Port already in use
```


# Kill process on port 3000

npx kill-port 3000

```

### Clear Next.js cache
```

rm -rf .next
npm run dev

```

### TypeScript errors
```

npm run typecheck

```

### ESLint issues
```

npm run lint:fix

```

## Project Structure

```

manga-platform/
├── src/
│   ├── app/              \# Next.js app router
│   │   ├── api/          \# API routes
│   │   ├── auth/         \# Auth pages
│   │   └── dashboard/    \# Dashboard
│   ├── modules/          \# Feature modules
│   │   └── users/        \# Users module
│   ├── lib/              \# Shared utilities
│   │   ├── api/          \# API helpers
│   │   ├── events/       \# Event bus
│   │   └── supabase/     \# Supabase client
│   └── components/       \# Shared components
├── public/               \# Static files
└── scripts/              \# Utility scripts

```

## What's Working

- ✅ User registration
- ✅ User login (email + username)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ User dashboard with stats
- ✅ Event system
- ✅ Type-safe API
- ✅ React Query state management
- ✅ Tailwind CSS styling

## Next Steps

See `NEXT_STEPS.md` for detailed roadmap.

---

**Happy coding!** ���
