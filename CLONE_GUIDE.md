# Locana Project - Complete Clone Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Tech Stack](#tech-stack)
3. [Learning Path](#learning-path)
4. [Setup Steps](#setup-steps)
5. [Project Structure](#project-structure)
6. [Deployment](#deployment)

---

## Prerequisites

### Required Software
| Software | Version | Purpose | Installation Time |
|----------|---------|---------|-------------------|
| Node.js | 18+ | JavaScript runtime | 5 min |
| npm/yarn | Latest | Package manager | Included with Node |
| Git | Latest | Version control | 5 min |
| VS Code | Latest | Code editor | 10 min |

### Required Accounts
| Service | Purpose | Setup Time | Cost |
|---------|---------|------------|------|
| GitHub | Code hosting | 5 min | Free |
| Vercel | Deployment | 5 min | Free |
| Supabase | Database & Auth | 10 min | Free |

---

## Tech Stack

### Frontend Technologies
| Technology | Version | Purpose | Learning Time | Resources |
|------------|---------|---------|---------------|-----------|
| **Next.js** | 14.2.16 | React framework | 2-3 days | [Next.js Docs](https://nextjs.org/docs) |
| **React** | 18 | UI library | 3-5 days | [React Docs](https://react.dev) |
| **TypeScript** | 5 | Type safety | 2-3 days | [TS Handbook](https://www.typescriptlang.org/docs/) |
| **Tailwind CSS** | 4.1.9 | Styling | 1-2 days | [Tailwind Docs](https://tailwindcss.com/docs) |

### UI Components
| Library | Purpose | Learning Time |
|---------|---------|---------------|
| **Radix UI** | Headless components | 1 day |
| **Lucide React** | Icons | 1 hour |
| **Shadcn/ui** | Component library | 1 day |
| **Class Variance Authority** | Component variants | 2 hours |

### Backend & Database
| Technology | Purpose | Learning Time | Resources |
|------------|---------|---------------|-----------|
| **Supabase** | PostgreSQL database | 1-2 days | [Supabase Docs](https://supabase.com/docs) |
| **Supabase Auth** | Authentication | 1 day | [Auth Guide](https://supabase.com/docs/guides/auth) |
| **Supabase SSR** | Server-side auth | 1 day | [SSR Guide](https://supabase.com/docs/guides/auth/server-side) |

### Additional Libraries
| Library | Purpose | Learning Time |
|---------|---------|---------------|
| **React Hook Form** | Form handling | 1 day |
| **Zod** | Schema validation | 1 day |
| **date-fns** | Date formatting | 2 hours |
| **Geist Font** | Typography | 30 min |

---

## Learning Path

### Phase 1: Fundamentals (2-3 weeks)
| Topic | Duration | Priority | Resources |
|-------|----------|----------|-----------|
| HTML/CSS Basics | 3 days | High | FreeCodeCamp |
| JavaScript ES6+ | 5 days | High | JavaScript.info |
| React Basics | 5 days | High | React.dev tutorial |
| TypeScript Basics | 3 days | High | TypeScript Handbook |

### Phase 2: Framework & Tools (2-3 weeks)
| Topic | Duration | Priority | Key Concepts |
|-------|----------|----------|--------------|
| Next.js App Router | 4 days | High | Routing, Layouts, Server Components |
| Tailwind CSS | 2 days | High | Utility classes, Responsive design |
| React Hooks | 3 days | High | useState, useEffect, useCallback |
| Context API | 2 days | Medium | Global state management |

### Phase 3: Backend & Database (1-2 weeks)
| Topic | Duration | Priority | Key Concepts |
|-------|----------|----------|--------------|
| Supabase Setup | 1 day | High | Project creation, API keys |
| PostgreSQL Basics | 2 days | High | Tables, Queries, Relations |
| Supabase Auth | 2 days | High | Sign up, Login, Sessions |
| Row Level Security | 2 days | Medium | Database security policies |

### Phase 4: Advanced Features (1-2 weeks)
| Topic | Duration | Priority | Key Concepts |
|-------|----------|----------|--------------|
| Geolocation API | 1 day | Medium | GPS, Coordinates |
| Form Validation | 1 day | Medium | Zod schemas |
| File Uploads | 1 day | Low | Image handling |
| Real-time Updates | 2 days | Low | Supabase Realtime |

---

## Setup Steps

### Step 1: Environment Setup (30 min)
```bash
# Install Node.js from nodejs.org
# Verify installation
node --version  # Should show v18+
npm --version   # Should show 9+

# Install Git
git --version

# Install VS Code
# Install VS Code extensions:
# - ES7+ React/Redux/React-Native snippets
# - Tailwind CSS IntelliSense
# - Prettier
```

### Step 2: Clone & Install (15 min)
```bash
# Clone repository
git clone <your-repo-url>
cd LOCANA_2

# Install dependencies
npm install

# This installs 60+ packages (~200MB)
```

### Step 3: Supabase Setup (20 min)
| Step | Action | Time |
|------|--------|------|
| 1 | Create account at supabase.com | 2 min |
| 2 | Create new project | 3 min |
| 3 | Wait for database provisioning | 2 min |
| 4 | Copy API keys from Settings > API | 1 min |
| 5 | Create `.env.local` file | 2 min |
| 6 | Run database migrations | 5 min |
| 7 | Set up authentication providers | 5 min |

### Step 4: Environment Variables (5 min)
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Database Schema (15 min)
Run in Supabase SQL Editor:
```sql
-- Users table (handled by Supabase Auth)

-- Shops table
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  category TEXT,
  phone TEXT,
  address TEXT,
  image_url TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id),
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  category TEXT,
  stock TEXT DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all shops" ON shops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own shop" ON shops FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
```

### Step 6: Run Development Server (2 min)
```bash
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

### Directory Layout
```
LOCANA_2/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── auth/              # Auth pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── home/             # Home page components
│   └── shops/            # Shop components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── supabase/         # Supabase client
├── public/               # Static assets
└── scripts/              # Build scripts
```

### Key Files
| File | Purpose | Lines of Code |
|------|---------|---------------|
| `app/layout.tsx` | Root layout, providers | ~60 |
| `components/home/customer-home.tsx` | Customer dashboard | ~300 |
| `components/home/owner-dashboard.tsx` | Owner dashboard | ~600 |
| `lib/supabase/client.ts` | Supabase client setup | ~10 |
| `contexts/cart-context.tsx` | Shopping cart state | ~100 |

---

## Deployment

### Vercel Deployment (10 min)
| Step | Action | Time |
|------|--------|------|
| 1 | Push code to GitHub | 2 min |
| 2 | Sign up at vercel.com | 2 min |
| 3 | Import GitHub repository | 1 min |
| 4 | Add environment variables | 2 min |
| 5 | Deploy | 3 min |

### Environment Variables in Vercel
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## Total Time Estimate

### Learning Phase
| Phase | Duration | Can Skip If |
|-------|----------|-------------|
| Fundamentals | 2-3 weeks | You know React |
| Framework & Tools | 2-3 weeks | You know Next.js |
| Backend & Database | 1-2 weeks | You know Supabase |
| Advanced Features | 1-2 weeks | Optional |
| **Total Learning** | **6-10 weeks** | **Beginner to Deploy** |

### Setup & Deployment
| Task | Duration |
|------|----------|
| Environment setup | 30 min |
| Clone & install | 15 min |
| Supabase setup | 20 min |
| Database schema | 15 min |
| Testing locally | 30 min |
| Deployment | 10 min |
| **Total Setup** | **2 hours** |

---

## Key Concepts to Master

### React Concepts
- ✅ Components & Props
- ✅ State Management (useState)
- ✅ Side Effects (useEffect)
- ✅ Context API
- ✅ Custom Hooks
- ✅ Event Handling

### Next.js Concepts
- ✅ App Router
- ✅ Server Components
- ✅ Client Components ("use client")
- ✅ Layouts
- ✅ Route Groups
- ✅ API Routes

### Supabase Concepts
- ✅ Authentication
- ✅ Database Queries
- ✅ Row Level Security
- ✅ Storage (for images)
- ✅ Realtime subscriptions

### Styling Concepts
- ✅ Tailwind utility classes
- ✅ Responsive design
- ✅ Component variants
- ✅ Dark mode support

---

## Common Issues & Solutions

| Issue | Solution | Time to Fix |
|-------|----------|-------------|
| Module not found | Run `npm install` | 2 min |
| Supabase connection error | Check environment variables | 5 min |
| Build errors | Check TypeScript types | 10 min |
| Styling not working | Restart dev server | 1 min |
| Auth not working | Check Supabase auth settings | 10 min |

---

## Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Video Tutorials
- Next.js 14 Tutorial (YouTube)
- Supabase Crash Course (YouTube)
- Tailwind CSS Full Course (YouTube)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- Stack Overflow

---

## Success Checklist

- [ ] Node.js installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] Vercel account created
- [ ] Supabase account created
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Database schema created
- [ ] Local development working
- [ ] Deployed to Vercel
- [ ] Authentication working
- [ ] Database queries working

---

**Estimated Total Time: 6-10 weeks (learning) + 2 hours (setup)**

**Difficulty Level: Intermediate**

**Prerequisites: Basic programming knowledge**
