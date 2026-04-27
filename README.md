This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Workspace App — Developer README

This repository is a Next.js App Router application that manages workspaces, lists, items and users. It uses MongoDB (Mongoose) for persistence and next-auth for authentication. This README contains instructions for developers to set up, run, and understand key architectural decisions and flows.

## Table of contents

- Quick start
- Environment variables
- Scripts
- Project structure overview
- Key concepts and flows
  - Invite acceptance and cache invalidation
  - DTO vs DB models
  - Server vs Client components
- Common tasks
  - Running locally
  - Running type checks / build
  - Creating invites and testing accept flow
- Troubleshooting
- Tests and next steps

## Quick start

1. Install dependencies:

```bash
npm install
# or
# pnpm install
# or
# yarn
```

2. Create a `.env.local` file in the project root with the variables listed below.

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

Create `.env.local` with at least the following variables:

- `MONGODB_URI` — MongoDB connection string (required)
- `NEXTAUTH_URL` — Base URL for app (e.g. `http://localhost:3000`) (used to construct invite links)
- `NEXTAUTH_SECRET` — Secret for next-auth
- Any OAuth provider credentials if you use providers in `next-auth` (optional)

Example:

```
MONGODB_URI=mongodb://localhost:27017/workspace-app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=verysecret
```

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — start production server after build
- `npm run lint` — run eslint

(See `package.json` for exact commands and versions.)

## Project structure (high level)

- `app/` — Next.js App Router pages and route handlers (server components by default)
- `components/` — React components, both client and server
- `actions/` — server actions used from client/server components (marked `use server` where needed)
- `lib/` — helpers, mappers, data access wrappers (cached helpers live here)
- `models/` — Mongoose models
- `types/` — DTOs and DB typings
- `public/` — icons and static assets

## Key concepts and flows

A few important architectural and behavioural details you need to know before editing code.

1. Server vs Client components

- Files under `app/` are server components by default. Use `"use client"` at the top of a file to make it a client component.
- Server components can perform direct DB reads and server actions. Client components must call server actions (via form actions or route `fetch`) or call API routes.

2. DTO vs DB models

- `lib/mappers` contains functions that map Mongoose documents (DB types) to DTOs used by UI components.
- Avoid calling mongoose document methods (`.save()`) on DTOs. Use Mongoose models (e.g. `Workspace.findById`) for writes and DTOs for reads/UI.

3. Caching and invalidation (important)

- Some read helpers use Next.js cache helpers (e.g. `unstable_cache` + tags like `workspace-<id>` and `user-workspaces-<userId>`).
- Next.js forbids calling revalidation functions (e.g. `revalidateTag`) during render/cached helper execution. Revalidation must run outside render, typically from server route handlers or server actions invoked from API routes.
- Invite acceptance flow uses a server route that performs DB writes and then calls `revalidatePath` / `revalidateTag` to invalidate caches; the page then redirects to workspace.

4. Invite acceptance flow (short)

- `actions/invite.ts::acceptInvite(token)` performs DB updates (adds member, increments uses) and returns `{ workspaceId, added, userId }`.
- `app/(auth)/invite/[token]/accept/route.ts` calls `acceptInvite`, then calls `revalidatePath` and `revalidateTag` (outside render) and redirects to the workspace page.
- The invite page (`/invite/[token]`) redirects to that accept route so the revalidation happens server-side before redirect.

## Common tasks

- Start dev server: `npm run dev`
- Run the TypeScript compiler (optional): `npx tsc --noEmit`
- Build for production: `npm run build`

### Creating and testing invites

- Create an invite via the UI or the `createInvite` action (see `actions/invite.ts`).
- Copy invite link and open in a different logged-in account or incognito.
- The invite page will redirect to `/invite/[token]/accept` which performs the DB write and revalidation, then redirects to workspace.
- If the UI still shows stale data, confirm that the `revalidateTag` tag matches the tags used in `unstable_cache` helpers (e.g. `workspace-<id>` and `user-workspaces-<userId>`).

## Troubleshooting

- If Next.js complains about calling `revalidateTag` during render, ensure the revalidation call is inside a route or server action invoked outside cached functions.
- If DTOs are missing fields at runtime, check mappers in `lib/mappers` — they should handle both populated and non-populated cases.
- If types error about `any` or `unknown`, prefer `unknown` in catches and narrow using `instanceof Error` before reading `message`.

## Tests & CI

- There are no automated tests included by default. For CI, run `npm run build` and `npx tsc --noEmit`.

## Development notes & next steps

- Consider adding small integration tests for invite flow and member management.
- Move large inline skeleton styles into CSS modules for consistent theming.
- Consider switching revalidation calls to background jobs (queue) if you expect heavy traffic.

---

If you'd like, I can:

- Run a `tsc` check and fix remaining TypeScript warnings,
- Add example `.env.local` file to repo as `.env.example`, or
- Create a short CONTRIBUTING.md with branching/PR rules and code style.

Tell me which follow-up you want and I'll do it next.
