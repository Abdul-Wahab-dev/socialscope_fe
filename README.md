# SocialScope Web (frontend)

Next.js 16 (App Router, **webpack** bundler; Turbopack is intentionally disabled via the `--webpack` flag in `dev` and `build`) + React 19 + TypeScript + Tailwind CSS v4 + React Hook Form + Zod. Data fetching uses small in-house hooks (no TanStack Query).

## Quick start

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm install
npm run dev                  # http://localhost:3000
```

The backend must be running (see `../BE/README.md`). Run both on `localhost` so the auth cookies set by the API are visible to the Next.js proxy.

## Folder structure

```
src/
  app/                     Routes only (thin pages that export metadata + render a view)
    (marketing)/           Public site: landing, /discover, /c/[username] media kit (SSR)
    (auth)/                /login, /register
    (dashboard)/           Authenticated area: /creator/*, /brand/*, /collabs/*, /settings
    checkout/              mock / success / cancelled
    error.tsx, not-found.tsx, layout.tsx, globals.css
  components/
    ui/                    Design-system primitives (Button, Input, Select, Dialog, Card, Badge, Tabs, Section, …)
    marketing/             Landing-page pieces (hero search, hero visual, FAQ)
    layout/                Header, footer, dashboard shell
    auth/ search/ creators/ collabs/ dashboard/ charts/   Feature components
  services/                API layer: function-based, one file per domain, every call wrapped in try/catch
  lib/query/               In-house data layer: QueryCache, useApiQuery, useApiMutation, useQueryCache
  lib/                     api-client (axios + silent token refresh), api-error (AppError), server-api, utils, form-errors
  hooks/                   use-auth, use-meta, use-creator, use-checkout, use-debounce
  providers/               Query-cache + Auth providers, toaster
  validations/             Zod schemas shared by forms (mirror the API rules)
  types/                   API and domain types
  constants/               routes, query keys, select options
  config/                  env + site/nav config
  proxy.ts                 Route protection (Next 16 replacement for middleware.ts)
```

## Design system

Tokens live in `src/app/globals.css` (`@theme`): brand violet scale plus a fuchsia→orange accent (`bg-brand-gradient`, `text-gradient`), `ink`/`canvas` neutrals, `shadow-soft` / `shadow-lift` / `shadow-glow`, and animations (`animate-fade-up`, `animate-marquee`, `animate-float`). Motion is disabled for users with `prefers-reduced-motion`. Fonts are Geist Sans/Mono, self-hosted through the `geist` package.

## Conventions

* **Services** (`src/services/*.service.ts`): every function is `async`, uses the shared `apiClient`, and converts any failure into an `AppError` (`message`, `status`, `code`, `fieldErrors`) with `toAppError`. Components never touch axios directly.
* **Forms**: `react-hook-form` + `zodResolver`. On submit errors, `handleFormError(error, setError, fields)` maps API validation errors onto the matching inputs and shows a toast for anything else.
* **Data fetching** (`src/lib/query`, no external library):
  * `useApiQuery({ queryKey, queryFn, enabled?, staleTime?, refetchInterval?, keepPreviousData?, retry? })` returns `{ data, error, isPending, isError, isSuccess, isLoading, isFetching, refetch }`. Results are cached per key (30 s fresh by default), identical requests in flight are shared, transient failures retry with backoff (4xx never), and the return type narrows: after `if (q.isPending) … if (q.isError) …`, `q.data` is typed as loaded.
  * `useApiMutation({ mutationFn, onSuccess?, onError?, onSettled? })` returns `{ mutate, mutateAsync, isPending, isSuccess, isError, error, variables, reset }`.
  * `useQueryCache()` gives `invalidate(keyPrefix)` (marks stale and refetches what's on screen), `setData(key, updater)`, `remove(predicate)` and `clear()`.
  * Keys come from `constants/query-keys.ts`; invalidating `['collabs']` refreshes every collab list, detail and message view.
* **Auth**: httpOnly cookies from the API. When the JWT expires the API returns `TOKEN_EXPIRED`, the axios interceptor refreshes once (shared between concurrent requests) and replays the request. `proxy.ts` does optimistic redirects using the `ss_session` hint cookie. Real checks always happen in the API.
* Public media kit pages are server-rendered with `generateMetadata` for link previews.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run lint`
