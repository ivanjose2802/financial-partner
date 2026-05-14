# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Personal finance app: cash flow, expenses, income, budgets, and financial overview. MVP-first, clean architecture, fast iteration.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, TanStack Query
- **Backend:** NestJS, TypeORM, PostgreSQL (Supabase), JWT auth, Swagger, class-validator
- **Infra:** Docker (local dev), Vercel (web), Railway/Render (api), Stripe (payments)

## Monorepo Structure

```
apps/
  web/        # Next.js App Router frontend
  api/        # NestJS backend
packages/
  shared/     # Shared types, DTOs, constants, utils
```

## Commands

```bash
# Root
docker compose up                                    # Start local PostgreSQL

# API — run from apps/api
npm run start:dev                                    # Dev server
npm run test                                         # All tests
npm run test -- --testPathPattern=auth               # Single test file
npm run migration:run                                # Run pending migrations
npm run migration:generate -- -n MigrationName       # Generate migration from entity changes

# Web — run from apps/web
npm run dev                                          # Dev server
npm run build                                        # Production build
npm run lint                                         # Lint
```

## Architecture Rules

- Business logic lives exclusively in NestJS services — never in the frontend
- All financial calculations are centralized in the API
- TypeORM entities + migrations only (no raw SQL unless justified)
- Backend is source of truth for auth and subscriptions
- Shared types/DTOs live in `packages/shared` and are imported by both apps

## Backend Conventions (NestJS)

Module layout: `module → controller → service → DTOs → entity`

- Guards handle auth; interceptors for cross-cutting concerns
- `class-validator` decorators on every DTO
- `@ApiProperty` Swagger decorators on all endpoints and DTOs
- One module per domain (e.g., `transactions`, `budgets`, `auth`)

## Frontend Conventions (Next.js)

- Server Components by default; add `"use client"` only when needed (interactivity, hooks)
- TanStack Query for all server state; local `useState`/`useReducer` for UI-only state
- shadcn/ui components exclusively — no custom UI primitives
- API calls go through a typed client, never raw fetch in components

## MVP Delivery Order

1. Monorepo structure + Docker setup
2. DB connection (TypeORM + Supabase)
3. Auth (JWT)
4. User entity
5. Transaction entities + CRUD
6. Dashboard APIs
7. Frontend dashboard
8. Stripe subscriptions
9. Budget system

## Working with Claude

- Propose a short plan before editing files
- Prefer small, incremental changes
- Keep implementations MVP-focused — no premature abstractions
- After every change: list modified files, how to test, and potential risks
- Do not introduce new dependencies unless clearly justified
