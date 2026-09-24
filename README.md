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

## Getting started

The repository holds two kinds of apps, each in its own folder with its own `package.json`:

- `svelte/` — the SvelteKit frontend.
- `service/` — the ExpressJS services the frontend talks to (one subfolder per service).

To run the frontend:

```bash
cd svelte
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run check    # type-check (svelte-check + tsc)
```

Each service in `service/` is started from its own folder in the same way (`npm install`, then
the scripts in its `package.json`).

## Lesson 1 — Components & thinking in components

- [`docs/design.md`](./docs/design.md) — the design spec for the site: what we're building,
  why, grounded in the interview transcripts.
- [`docs/assignment-1.md`](./docs/assignment-1.md) — the assignment: refactor the monolithic
  `src/App.svelte` homepage into a proper component structure.

## Project structure

```text
svelte/              # the SvelteKit app — run npm commands from here
  package.json
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
        +page.svelte      # /book-appointment route (header + footer only, WIP)
    lib/
      data.ts          # content: services, vets, opening hours, etc.
      state/           # shared state (runes in .svelte.ts files)
      components/
        atoms/          # Button, Badge, NavLink, ...
        molecules/      # ServiceCard, AppointmentTypeSelect, ...
        organisms/      # SiteHeader, ServicesSection, ...
service/             # ExpressJS services used by the Svelte app
  README.md
docs/
  design.md          # design spec for the site
  assignment-1.md     # Lesson 1 assignment
  screenshots/        # reference renders of the approved design
  submissions/         # reference solution + student submissions
steps/
  steps.md           # step-by-step lesson walkthrough (also as PDF)
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
