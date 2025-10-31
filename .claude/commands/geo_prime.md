---
allowed-tools: Bash, Read, Glob
description: Load context for Gist GEO landing page - understand codebase, Convex integration, shadcn/ui patterns, and deployment
---

# Gist GEO Prime

Load complete context for the Gist GEO landing page project, including frontend, backend, and deployment setup.

## Run

```bash
git ls-files
git remote -v
git log --oneline -5
```

## Read

### Project Documentation
- README.md
- doc/cur.md
- DEPLOY.md

### Convex Backend (Critical)
- convex/schema.ts
- convex/signups.ts
- convex/_generated/api.d.ts
- docs/convexdocs/convex_database.md
- docs/convexdocs/convex_functions.md
- docs/convexdocs/convex_auth.md

### Frontend Components
- app/page.tsx
- app/layout.tsx
- app/providers.tsx
- components/email-signup-input.tsx

### shadcn/ui Patterns
- docs/shadcn/shadcn_component_library_bp.md
- docs/shadcn/variants.md

### Configuration
- vercel.json
- package.json
- components.json

### Next.js Updates
- docs/next_js_docs/next_js_update.md

## Summary

After reading all files, provide a comprehensive summary covering:

### 1. Project Overview
- **Purpose**: Gist GEO landing page for collecting email signups
- **Status**: Phase 2 complete - LIVE IN PRODUCTION
- **URLs**:
  - Frontend: Vercel deployment
  - Backend: `https://fearless-ibis-167.convex.cloud`
  - Dashboard: https://dashboard.convex.dev

### 2. Tech Stack
- **Frontend**: Next.js 16.0.1, React 19.2.0, TypeScript 5.9.3
- **Backend**: Convex (production deployment)
- **Styling**: Tailwind CSS 3.4.18, shadcn/ui with CVA
- **Runtime**: Bun v1.3.1
- **Deployment**: Vercel (frontend), Convex (backend)

### 3. Convex Integration (Critical Understanding)

**Database Schema**:
```typescript
signups: defineTable({
  email: v.string(),
  source: v.optional(v.string()),
}).index("by_email", ["email"])
```

**Mutation API**:
```typescript
export const createSignup = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // 1. Server-side validation
    // 2. Indexed duplicate check (O(log n))
    // 3. Silent duplicate handling (UX-friendly)
    // 4. Returns: { success: true, duplicate: boolean }
  }
});
```

**Frontend Connection**:
```typescript
// app/providers.tsx
<ConvexProvider client={convex}>

// app/page.tsx
const createSignup = useMutation(api.signups.createSignup);
await createSignup({ email });
```

**Deployment Workflow**:
- Dev: `bunx convex dev` → marvelous-hound-317 (local dev deployment)
- Prod: `npx convex deploy --yes` → fearless-ibis-167 (production)
- Frontend uses: `NEXT_PUBLIC_CONVEX_URL=https://fearless-ibis-167.convex.cloud`

**Key Convex Patterns**:
- ✅ Indexed queries for performance (not `.filter()`)
- ✅ Type-safe mutations with argument validation
- ✅ Auto-generated TypeScript types in `_generated/`
- ✅ Separate dev/prod deployments
- ✅ Real-time dashboard for monitoring

### 4. shadcn/ui Best Practices
- **Code Ownership**: Components in your codebase, not node_modules
- **CVA Variants**: Type-safe state variants (default, submitted, success, error)
- **React.forwardRef**: Proper ref forwarding
- **Composition**: Clean component API with props
- **TypeScript**: Full type safety with VariantProps

### 5. EmailSignupInput Component
- **States**: 4-state variant system with visual feedback
- **Validation**: Client (regex) + Server (Convex mutation)
- **Duplicate Handling**: Silent success (UX-friendly)
- **Auto-Reset**: Success state resets after 3 seconds
- **Icons**: Dynamic (bell, arrow-up, checkmark)

### 6. Development Workflow

**Local Development**:
```bash
# Terminal 1: Convex dev server
bunx convex dev

# Terminal 2: Next.js dev server
bun run dev
```

**Deployment**:
```bash
# Frontend (auto-deploy via Vercel on push to main)
git push origin main

# Backend (manual deploy for Convex changes)
npx convex deploy --yes
```

**Environment Variables**:
- Dev: Auto-generated in `.env.local` by `bunx convex dev`
- Prod: Set in Vercel dashboard as `NEXT_PUBLIC_CONVEX_URL`

### 7. Production Architecture

```
User Browser
    ↓ HTTPS
Vercel CDN (Global)
    ↓ Next.js SSR/SSG
React App with ConvexProvider
    ↓ WebSocket/HTTP
Convex Production (fearless-ibis-167)
    ↓ Real-time Sync
Database (signups table)
    ↓ Monitoring
Dashboard (dashboard.convex.dev)
```

### 8. Key Files & Their Roles

**Backend**:
- `convex/schema.ts` - Database schema definition
- `convex/signups.ts` - Mutation for creating signups
- `convex/_generated/` - Auto-generated TypeScript types

**Frontend**:
- `app/providers.tsx` - Convex client setup
- `app/page.tsx` - Connects useMutation to component
- `components/email-signup-input.tsx` - 4-state form component

**Config**:
- `vercel.json` - Vercel deployment settings (Bun runtime)
- `.env.local` - Convex URL (git-ignored)
- `package.json` - Dependencies (Next.js 16, React 19, Convex)

### 9. Next Steps (Phase 3)
- Clerk OAuth integration (social login)
- Email verification via Convex actions
- Admin dashboard for managing signups
- Custom domain setup (gistgeo.ai)
- Analytics integration (Vercel Analytics)

---

**Critical Context for New Sessions:**

1. **Convex is deployed and working** - Backend is live in production
2. **Two deployments exist**: Dev (`marvelous-hound-317`) and Prod (`fearless-ibis-167`)
3. **Frontend changes**: Auto-deploy via Vercel on git push
4. **Backend changes**: Require `npx convex deploy --yes`
5. **Environment**: Production uses `NEXT_PUBLIC_CONVEX_URL` env var
6. **shadcn/ui philosophy**: Customize variants, own the component code
7. **Next.js 16**: Use async Request APIs, Turbopack default

This guide ensures alignment with the project's full-stack architecture, Convex integration patterns, shadcn/ui best practices, and production deployment workflow.
