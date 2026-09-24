# Kliniek Van Dijk — frontend course material

Course material and assignments for the frontend lessons built around a single running case:
a public website for a fictional veterinary practice, **Kliniek Van Dijk**. The case is based
on the stakeholder interviews in
[HZ-HBOICT-UVE-2627/veterinarian-case](https://github.com/HZ-HBOICT-UVE-2627/veterinarian-case).

Each lesson builds on the same codebase, so by the end of the course you'll have iterated on
one real (if fictional) product rather than a series of disconnected exercises.

## Tech stack

- [Svelte 5](https://svelte.dev/) (runes: `$state`, `$derived`, `$props()`)
- [SvelteKit](https://svelte.dev/docs/kit) — file-based routing (`svelte/src/routes/`), `@sveltejs/adapter-auto`
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Vite](https://vite.dev/) as the build tool
- [Express](https://expressjs.com/) + [Prisma](https://www.prisma.io/) (SQLite) for the backend services

## Getting started

The repository holds two kinds of apps, each in its own folder with its own `package.json`:

- `svelte/` — the SvelteKit frontend.
- `services/` — the ExpressJS services the frontend talks to (one subfolder per service).

To run the frontend:

```bash
cd svelte
cp .env.example .env   # first time only: the URLs of the services
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run check    # type-check (svelte-check + tsc)
```

Each service in `services/` is started from its own folder in the same way (`npm install`, then
the scripts in its `package.json`). The booking page loads its data from
`services/vets_service`, so start that service first:

```bash
cd services/vets_service
npm install
npm run dev      # http://localhost:4000 — first time: see its README for the database setup
```

## Lesson 1 — Components & thinking in components

- [`docs/design.md`](./docs/design.md) — the design spec for the site: what we're building,
  why, grounded in the interview transcripts.
- [`docs/assignment-1.md`](./docs/assignment-1.md) — the assignment: refactor the monolithic
  `src/App.svelte` homepage into a proper component structure.

## Lesson 4 — Loading data from a service

- [`docs/assignment-4.md`](./docs/assignment-4.md) — the assignment: load data from the vets
  service in a page (`load` in `+page.server.ts`) and in a component (`onMount`), compare the
  consequences of both choices, and type the API data correctly.
- The booking page (`/book-appointment`) is the worked example: the vets are loaded by the
  page, the appointment types by `AppointmentTypeSelect` itself.

## Project structure

```text
svelte/              # the SvelteKit app — run npm commands from here
  package.json
  .env.example       # service URLs — copy to .env
  svelte.config.js
  vite.config.ts
  static/
  src/
    app.html           # SvelteKit HTML shell
    app.css            # Tailwind import + design tokens (colors, fonts)
    routes/
      +layout.svelte    # shared shell: global CSS, <title>
      +page.svelte       # homepage — composed from components, see Assignment 1
      book-appointment/
        +page.server.ts   # loads the vets from the vets service (Assignment 4)
        +page.svelte      # /book-appointment route: booking form + summary
    lib/
      data.ts          # content: services, vets, opening hours, etc.
      state/           # shared state (runes in .svelte.ts files)
      components/
        atoms/          # Button, Badge, NavLink, ...
        molecules/      # ServiceCard, AppointmentTypeSelect, ...
        organisms/      # SiteHeader, ServicesSection, ...
services/            # ExpressJS services used by the Svelte app
  vets_service/      # treatments, vets and appointment types (Express + Prisma + SQLite)
docs/
  design.md          # design spec for the site
  assignment-1.md     # Lesson 1 assignment
  assignment-4.md     # Lesson 4 assignment
  screenshots/        # reference renders of the approved design
  steps/              # step-by-step lesson walkthrough
  submissions/         # reference solution + student submissions
```

> The code started as a plain Vite+Svelte app and was later migrated to SvelteKit. The Lesson 1
> docs (`docs/assignment-1.md`, `docs/submissions/reference-solution-notes.md`) still refer to
> `src/App.svelte` — that file no longer exists; its content now lives in
> `svelte/src/routes/+page.svelte`. See git history for the original.
>
> Since Lesson 4 the SvelteKit app lives in `svelte/` instead of the repository root, so paths
> in older docs and steps that start with `src/` now start with `svelte/src/`.

## Branches

- `main` — the original Lesson 1 starting point (one monolithic `App.svelte`, pre-SvelteKit).
- `start/lessonN` — the starting point for lesson N.
- `solution/...` — reference solutions.
