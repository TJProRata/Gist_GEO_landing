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

- [ ] Responsive design (mobile + desktop)
- [ ] Email signup form
- [ ] Notification preferences
- [ ] Convex backend integration
- [ ] Clerk OAuth integration

## Setup

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
# Add CONVEX_DEPLOYMENT and CLERK keys

# Run development server
bun run dev
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
