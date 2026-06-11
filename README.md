# INAMAAD v3.0

**Verified Real Estate Investment Marketplace**  
Nigeria's institutional-grade PropTech platform for investors, developers, landowners, and agents.

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Routing | TanStack Router v1 |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v3 |
| Backend | Supabase (Auth + Database + Storage + Realtime) |
| Database | PostgreSQL (via Supabase) |
| Hosting | Vercel |

---

## Project Structure

```
inamaad/
├── src/
│   ├── types/
│   │   └── database.ts          # All TypeScript types
│   ├── lib/
│   │   └── supabase.ts          # Supabase client + auth helpers
│   ├── hooks/
│   │   └── index.ts             # All React Query hooks
│   ├── components/
│   │   ├── ui/                  # Buttons, badges, inputs, cards
│   │   ├── layout/              # Navigation, footer, sidebar
│   │   ├── listings/            # ListingCard, ListingGallery, etc.
│   │   ├── jv/                  # JV cards and detail components
│   │   ├── dashboard/           # Dashboard widgets
│   │   └── auth/                # Auth forms
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx            # Homepage
│   │   ├── properties/
│   │   ├── jv/
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── admin/
│   │   └── auth/
│   └── main.tsx
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql       # All tables, triggers, enums
│       └── 002_rls_policies.sql # All Row Level Security policies
├── .env.example
├── LAUNCH_CHECKLIST.md
├── package.json
├── tailwind.config.js
└── vercel.json
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-org/inamaad.git
cd inamaad
npm install
```

### 2. Supabase project

1. Go to https://supabase.com and create a new project
2. In the SQL Editor, run `supabase/migrations/001_schema.sql`
3. Then run `supabase/migrations/002_rls_policies.sql`
4. Create 6 storage buckets (see .env.example for names):
   - `profile-images` — public read
   - `listing-images` — public read
   - `listing-videos` — public read
   - `property-documents` — private (access via RLS)
   - `verification-documents` — private
   - `system-assets` — public read
5. Enable Email auth in Authentication → Providers

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in:
- `VITE_SUPABASE_URL` — from Supabase project Settings → API
- `VITE_SUPABASE_ANON_KEY` — from Supabase project Settings → API

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:5173

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles routing and security headers automatically

---

## Creating the first admin user

After first signup, manually set a user's role to admin via Supabase dashboard:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

---

## Adding the increment_view_count RPC

Add this function to your Supabase project (SQL Editor):

```sql
CREATE OR REPLACE FUNCTION increment_view_count(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings SET view_count = view_count + 1 WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Pre-Launch

Work through `LAUNCH_CHECKLIST.md` before going live. Every item must be verified.

---

## Key business rules enforced in DB

| Rule | Enforcement |
|------|-------------|
| Max 30 images per listing | Database trigger |
| Max 3 videos per listing | Database trigger |
| Soft delete only | `deleted_at` column + RLS |
| Auto-create profile on signup | `on_auth_user_created` trigger |
| Auto-update conversation last_message | `on_message_insert` trigger |
| Auto-update save_count | `on_saved_listing_change` trigger |
| JV has no bedroom/bathroom fields | Schema design (separate table) |
| All actions must be logged | `activity_logs` table + app-level logging |

---

*INAMAAD v3.0 — Built for Nigeria. Scaling across Africa.*
