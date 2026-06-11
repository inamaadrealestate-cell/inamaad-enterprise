# INAMAAD v3.0 — Pre-Launch Verification Checklist

**Platform:** Enterprise PropTech Marketplace  
**Stack:** React + TypeScript + Supabase + Vercel  
**Document version:** 3.0  
**Status:** Complete before any public launch

Mark each item ✅ when confirmed working, ❌ if failing, ⏳ if in progress.

---

## 1. ENVIRONMENT & DEPLOYMENT

### 1.1 Environment Variables
- [ ] `VITE_SUPABASE_URL` is set in Vercel project settings
- [ ] `VITE_SUPABASE_ANON_KEY` is set in Vercel project settings
- [ ] `.env` file is in `.gitignore` and NOT committed to repo
- [ ] No secrets are hardcoded anywhere in the codebase

### 1.2 Vercel Deployment
- [ ] GitHub repo connected to Vercel project
- [ ] Production domain configured (e.g. inamaad.com)
- [ ] Custom domain has valid SSL certificate (auto via Vercel)
- [ ] `vercel.json` rewrites are working (all routes return the React app)
- [ ] Security headers are present (check via https://securityheaders.com)
- [ ] Build completes without TypeScript errors (`npm run type-check`)
- [ ] Build completes without ESLint errors (`npm run lint`)
- [ ] Lighthouse score: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90

---

## 2. SUPABASE SETUP

### 2.1 Database
- [ ] `001_schema.sql` has been run successfully (no errors)
- [ ] `002_rls_policies.sql` has been run successfully (no errors)
- [ ] All 17 tables exist in the `public` schema
- [ ] All ENUM types are created
- [ ] All triggers are active (`set_updated_at`, `check_max_images`, `check_max_videos`, `on_message_insert`, `on_saved_listing_change`, `on_auth_user_created`)
- [ ] `increment_view_count` RPC function is created (add to schema if missing)
- [ ] Indexes are present on all foreign key columns

### 2.2 Authentication
- [ ] Email/password auth is enabled in Supabase Auth settings
- [ ] Email confirmation is enabled
- [ ] Confirmation email redirects to correct URL (your domain + `/auth/verify-email`)
- [ ] `on_auth_user_created` trigger auto-creates a profile row on signup
- [ ] Password reset email is configured
- [ ] Session expiry is set (recommended: 1 week)
- [ ] Rate limiting is enabled for auth endpoints

### 2.3 Row Level Security
Run these checks in Supabase SQL Editor:

```sql
-- Verify RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- All tables should show rowsecurity = true
```

- [ ] All tables show `rowsecurity = true`
- [ ] `profiles`: public can read non-suspended; users can update own
- [ ] `listings`: public can read approved; owners can CRUD own; admins can CRUD all
- [ ] `property_documents`: deed_of_assignment restricted to admin + owner only
- [ ] `conversations`: only participants can read
- [ ] `messages`: only sender/receiver can read
- [ ] `notifications`: only recipient can read
- [ ] `activity_logs`: only admins can read
- [ ] Test as anonymous user: cannot access private data
- [ ] Test as investor: cannot create listings
- [ ] Test as owner: can only update own listings

### 2.4 Storage Buckets
Verify each bucket exists in Supabase Storage:

- [ ] `profile-images` — authenticated upload, public read
- [ ] `listing-images` — owner upload, public read
- [ ] `listing-videos` — owner upload, public read
- [ ] `property-documents` — owner upload, restricted read
- [ ] `verification-documents` — user upload, admin + user read only
- [ ] `system-assets` — admin upload, public read
- [ ] Max file size for images is set to 10MB
- [ ] Max file size for videos is set to 200MB
- [ ] Allowed MIME types are configured per bucket (images: jpg/jpeg/png/webp, videos: mp4/mov/webm)

---

## 3. AUTHENTICATION FLOWS

### 3.1 Registration
- [ ] User can sign up with email + password
- [ ] Confirmation email is received within 2 minutes
- [ ] Clicking confirmation link activates the account
- [ ] Profile row is auto-created in `profiles` table
- [ ] User is redirected to complete profile step
- [ ] Role selection works (investor / landowner / developer / agent)
- [ ] Duplicate email shows clear error message

### 3.2 Login
- [ ] Correct credentials log in successfully
- [ ] Wrong password shows error (does not reveal if email exists)
- [ ] Unconfirmed email shows clear message
- [ ] Suspended account shows clear message
- [ ] Session persists across browser refresh
- [ ] Session persists across tab close and reopen

### 3.3 Password Reset
- [ ] "Forgot password" sends reset email
- [ ] Reset link works and allows new password
- [ ] Old password no longer works after reset
- [ ] Reset link expires after 1 hour

### 3.4 Sign Out
- [ ] Sign out clears session
- [ ] Signed-out user cannot access dashboard routes
- [ ] Protected routes redirect to login

---

## 4. USER PERMISSIONS

Test each role by logging in as a test user with that role:

### 4.1 Investor
- [ ] Can browse all approved listings ✓
- [ ] Can browse JV opportunities ✓
- [ ] Can save listings ✓
- [ ] Can message listing owners ✓
- [ ] Can view own deal pipeline ✓
- [ ] Cannot access admin dashboard ✗
- [ ] Cannot create listings ✗
- [ ] Cannot verify listings ✗

### 4.2 Landowner
- [ ] Can create land listings ✓
- [ ] Can create JV opportunities ✓
- [ ] Can upload documents ✓
- [ ] Can reply to messages ✓
- [ ] Cannot approve/reject listings ✗

### 4.3 Developer
- [ ] Can create listings (residential, commercial, JV) ✓
- [ ] Can communicate with investors ✓
- [ ] Cannot access admin tools ✗

### 4.4 Agent
- [ ] Can create listings ✓
- [ ] Can receive enquiries ✓
- [ ] Cannot verify listings ✗

### 4.5 Admin
- [ ] Can view all listings regardless of status ✓
- [ ] Can approve/reject listings ✓
- [ ] Can verify users ✓
- [ ] Can suspend accounts ✓
- [ ] Can view activity logs ✓
- [ ] Can view all reports ✓
- [ ] Can review verification requests ✓

---

## 5. LISTING WORKFLOWS

### 5.1 Listing Creation
- [ ] Category selection works (Residential / Commercial / Land / JV)
- [ ] Required fields are validated before submission
- [ ] JV form does NOT show bedroom/bathroom fields
- [ ] Image upload works (drag-and-drop + click)
- [ ] Image compression runs before upload
- [ ] Cover image selection works
- [ ] Image reordering works
- [ ] Max 30 images enforced (UI + database trigger)
- [ ] Video upload works (max 3, max 200MB each)
- [ ] Document upload works for all document types
- [ ] Listing submits with status `pending_review`
- [ ] Owner receives confirmation notification

### 5.2 Admin Review
- [ ] Pending listings appear in admin dashboard
- [ ] Admin can approve → status changes to `approved`
- [ ] Admin can reject → status changes to `rejected`
- [ ] Approved listing appears in public search
- [ ] Rejected listing does NOT appear in public search
- [ ] Action is logged in `activity_logs`

### 5.3 Listing Detail
- [ ] All images display correctly in gallery
- [ ] Fullscreen gallery works
- [ ] Verified badges display (listing + owner)
- [ ] Document section shows "Access on request" for restricted docs
- [ ] View count increments on each visit
- [ ] Share button works
- [ ] Save/unsave toggles correctly

### 5.4 Soft Delete
- [ ] Deleted listings disappear from public search
- [ ] Deleted listings still visible to owner in dashboard
- [ ] `deleted_at` is set (not hard delete)

---

## 6. MESSAGING SYSTEM

- [ ] "Contact Owner" creates a conversation linked to the listing
- [ ] Owner receives notification of new message
- [ ] Both participants can see the conversation
- [ ] Messages display in chronological order
- [ ] Unread count shows in navbar
- [ ] Marking as read works
- [ ] Third parties cannot see private conversations (test with RLS)
- [ ] Conversation persists indefinitely (no auto-delete)

---

## 7. NOTIFICATIONS

- [ ] New message triggers notification for receiver
- [ ] Listing status change triggers notification for owner
- [ ] Saved listing change triggers notification for saver
- [ ] Verification status update triggers notification for user
- [ ] Notification bell shows unread count
- [ ] Clicking notification marks it as read
- [ ] Notification links navigate to correct page

---

## 8. DEAL PIPELINE

- [ ] Pipeline entry is created when investor enquires
- [ ] Stages advance correctly (new_lead → closed)
- [ ] Investor can see their own pipeline
- [ ] Listing owner can see pipeline for their listings
- [ ] Admin can see all pipeline entries
- [ ] Third parties cannot see deal pipeline (test with RLS)
- [ ] Stage updates are logged in activity_logs

---

## 9. VERIFICATION SYSTEM

- [ ] User can submit verification request with documents
- [ ] Documents upload to `verification-documents` bucket
- [ ] Admin can view submitted documents
- [ ] Admin can approve → profile `is_verified = true`, `verification_level` updated
- [ ] Admin can reject with review notes
- [ ] Verified badge appears on profile, listings, search results, messages
- [ ] Verification action is logged
- [ ] Non-admin cannot access other users' verification documents

---

## 10. REPORTING SYSTEM

- [ ] Any user can report a listing / user / message
- [ ] Report appears in admin dashboard
- [ ] Admin can review and update report status
- [ ] Admin actions on reports are logged
- [ ] Reported content remains visible until admin acts

---

## 11. MEDIA & UPLOADS

### 11.1 Images
- [ ] JPG, JPEG, PNG, WEBP all accepted
- [ ] Files over 10MB are rejected with clear error
- [ ] Invalid file types (PDF, exe, etc.) are rejected
- [ ] Images render correctly on listing cards
- [ ] Images render correctly in full-screen gallery
- [ ] Cover image shows first in gallery
- [ ] Lazy loading works on listings page
- [ ] Images load on mobile (responsive sizes)

### 11.2 Videos
- [ ] MP4, MOV, WEBM accepted
- [ ] Files over 200MB rejected
- [ ] Max 3 videos enforced
- [ ] Video player works on detail page
- [ ] Thumbnail generation works

### 11.3 Documents
- [ ] Upload to correct bucket (`property-documents`)
- [ ] Download only works for authorized users
- [ ] Deed of assignment is hidden from non-admin, non-owner users
- [ ] Admin-verified badge shows after admin marks document as verified

---

## 12. SEARCH & FILTERS

- [ ] Keyword search works (title + description)
- [ ] Filter by state works
- [ ] Filter by listing type works
- [ ] Filter by price range works
- [ ] Filter by verification status works
- [ ] Sort by newest/oldest/price/views/saves works
- [ ] Empty state shows when no results
- [ ] Search results only show approved, non-deleted listings
- [ ] Pagination / infinite scroll works

---

## 13. MOBILE EXPERIENCE

Test on real devices or browser dev tools at these widths:

- [ ] 320px — no horizontal scroll, all content readable
- [ ] 375px — standard mobile (iPhone SE)
- [ ] 768px — tablet
- [ ] 1024px — small desktop
- [ ] 1440px — standard desktop

Specific mobile checks:
- [ ] Navigation collapses to mobile menu
- [ ] Gallery supports swipe gestures
- [ ] Touch targets are minimum 44×44px
- [ ] Forms are usable without zooming (inputs ≥ 16px font)
- [ ] Messaging is usable on mobile keyboard

---

## 14. PERFORMANCE

Run Lighthouse on the production URL:

- [ ] Performance score ≥ 90
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) < 100ms
- [ ] Images are compressed and served in WebP where possible
- [ ] Fonts are preloaded
- [ ] Code splitting is working (check Network tab for lazy chunks)

---

## 15. SECURITY

- [ ] HTTPS everywhere (no HTTP URLs in the app)
- [ ] Security headers present (CSP, X-Frame-Options, X-XSS-Protection)
- [ ] No API keys visible in browser source or network requests
- [ ] Supabase anon key is the only key exposed (this is safe by design)
- [ ] Input fields are sanitized (no XSS via listing title/description)
- [ ] File upload validates type server-side (not just client-side)
- [ ] Admin routes are protected by role check (not just hidden in UI)
- [ ] Rate limiting is enabled on auth endpoints
- [ ] `activity_logs` records all sensitive actions

---

## 16. AUDIT LOGGING

Verify these actions are logged in `activity_logs`:

- [ ] User login
- [ ] Profile update
- [ ] Listing created
- [ ] Listing updated
- [ ] Listing approved (admin)
- [ ] Listing rejected (admin)
- [ ] Listing deleted
- [ ] Verification submitted
- [ ] Verification approved (admin)
- [ ] Verification rejected (admin)
- [ ] Message sent
- [ ] Conversation started
- [ ] Deal stage updated
- [ ] User suspended (admin)
- [ ] Report filed

---

## 17. ADMIN DASHBOARD

- [ ] Overview stats are accurate (total users, listings, JV, messages)
- [ ] User management: view, suspend, role-change work
- [ ] Listing management: approve, reject, feature, archive work
- [ ] Verification management: view documents, approve, reject, add notes
- [ ] Reports management: view, update status work
- [ ] All admin actions are logged
- [ ] Admin dashboard is completely inaccessible to non-admin users

---

## 18. FINAL CHECKS

- [ ] All page titles and meta descriptions are set (for SEO)
- [ ] 404 page exists and is styled
- [ ] Error boundary catches unexpected crashes gracefully
- [ ] Empty states exist for all lists (no listings, no messages, etc.)
- [ ] Loading skeletons display during data fetch
- [ ] Privacy policy page exists
- [ ] Terms of use page exists
- [ ] Contact information is accurate
- [ ] Social links work (if applicable)
- [ ] Test account credentials are removed or changed before launch

---

## SIGN-OFF

| Area | Verified by | Date |
|------|-------------|------|
| Database & RLS | | |
| Authentication | | |
| Listings & Media | | |
| Messaging | | |
| Admin Dashboard | | |
| Security | | |
| Mobile & Performance | | |

**Platform is ready to launch when all items above are checked ✅**

---

*INAMAAD v3.0 Pre-Launch Checklist — Generated from Enterprise Build Blueprint*
