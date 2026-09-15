# StudentLoop

A responsive campus community MVP built with React, Vite, TypeScript, Express, and optional PostgreSQL storage.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173. Vite runs the frontend and proxies `/api` to Express on port 3001. Without a database, the API uses seeded in-memory posts, while the browser remembers your demo activity.

## Connect PostgreSQL

```sh
docker compose up -d
cp .env.example .env
npm run dev
```

For an existing PostgreSQL instance, set `DATABASE_URL` in `.env` to its connection string. The API initializes its `posts` table and inserts demo posts automatically. SQL writes use parameterized queries. `GET /api/health` reports the active storage mode.

## Build

```sh
npm run build
npm start
```

Express serves the built application and API at http://localhost:3001. `npm run preview` previews only the frontend; use `npm start` for API persistence.

## Included

- Named campus profiles and a responsive campus feed
- Text/image posts, reactions, comments, bookmarks, search, popular sorting
- Interest loops with join/leave actions and feed filtering
- Events with RSVP state
- Two demo direct-message conversations
- Desktop, tablet, and mobile navigation

## Prototype scope

All students, campus activity, invitations, and events are fictional. Alex Morgan is a shared demo identity, not an authenticated account. PostgreSQL persists posts (including demo comments and reactions); loop membership, event RSVPs, and messages remain in local browser storage. The interface reads cached posts first and is not a real-time multi-user client. Images and fonts use external public providers.

Before a real student launch, add university email verification, authenticated per-user ownership and authorization, private server-backed messaging, normalized user/reaction tables, pagination, moderation/report handling, image storage, rate limiting, and a privacy policy. The demo API is intentionally for local prototype use.

## Discovery-first experience

The home screen prioritizes local clubs, upcoming events, and students with shared interests. Pick interests to rank club and student suggestions, join a club, view its next event, RSVP, and start a demo conversation. Clubs supports interest and membership filters; Events includes My plans. These preferences and memberships persist on this device. The campus feed remains available for ongoing conversations. All club locations, member counts, and student profiles are sample content, not verified local listings.
