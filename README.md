# Gist GEO Landing Page

Coming soon landing page for [gistgeo.ai](https://gistgeo.ai/) - Generative Engine Optimization for Gist.

## User Story

As a user, I want to visit gistgeo.ai on mobile/desktop and sign up for launch notifications.

## Tech Stack

- **Next.js**: 16
- **Bun**: v1.3.1
- **React**: 19.2
- **TypeScript**: 5.9.3
- **Database**: Convex (signup storage)
- **Auth**: Clerk (OAuth)

## Features

- [x] Responsive design (mobile + desktop)
- [x] Email signup form
- [x] Convex backend integration
- [ ] Notification preferences
- [ ] Clerk OAuth integration

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for complete deployment instructions to Vercel.

## Setup

```bash
# Install dependencies
bun install

# Initialize Convex backend
bunx convex dev
# This will:
# - Prompt you to log in (or create account)
# - Create a new Convex project
# - Generate .env.local with NEXT_PUBLIC_CONVEX_URL
# - Start the Convex dev server

# Run development server (in separate terminal)
bun run dev
```

### Environment Variables

After running `bunx convex dev`, your `.env.local` will be automatically created with:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Project Structure

```
geo-gist-landing/
├── app/              # Next.js 16 app directory
├── components/       # React components
├── convex/          # Convex backend functions
├── public/          # Static assets
└── lib/             # Utilities
```

## Next Steps

1. Initialize Next.js project with Bun
2. Set up Convex database
3. Configure Clerk authentication
4. Design coming soon page
5. Implement signup flow
