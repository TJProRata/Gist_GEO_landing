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

### Convex Backend
- convex/schema.ts
- convex/signups.ts
- docs/convexdocs/convex_database.md
- docs/convexdocs/convex_functions.md

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

After reading all files, provide a summary covering:

1. **Project Purpose**: Gist GEO landing page for email signups
2. **Tech Stack**: Next.js 16, React 19, Convex, Vercel, Bun, shadcn/ui
3. **Current Status**: Phase 2 complete - live in production
4. **Architecture**: Full-stack TypeScript with Convex backend
5. **Key Features**: 4-state email component, server validation, duplicate handling
6. **Development**: Local dev with \`bunx convex dev\` + \`bun run dev\`
7. **Deployment**: Vercel (frontend) + Convex production (backend)
8. **Next Steps**: Phase 3 - Clerk OAuth, email verification, admin dashboard

This will guide your prompting to align with the project's architecture, shadcn/ui best practices, and Convex integration patterns.
