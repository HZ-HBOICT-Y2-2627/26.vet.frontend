# Kliniek Van Dijk — frontend course material

Course material and assignments for the frontend lessons built around a single running case:
a public website for a fictional veterinary practice, **Kliniek Van Dijk**. The case is based
on the stakeholder interviews in
[HZ-HBOICT-UVE-2627/veterinarian-case](https://github.com/HZ-HBOICT-UVE-2627/veterinarian-case).

Each lesson builds on the same codebase, so by the end of the course you'll have iterated on
one real (if fictional) product rather than a series of disconnected exercises.

## Tech stack

- [Svelte 5](https://svelte.dev/) (runes: `$state`, `$derived`, `$props()`)
- [SvelteKit](https://svelte.dev/docs/kit) — file-based routing (`src/routes/`), `@sveltejs/adapter-auto`
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Vite](https://vite.dev/) as the build tool

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run check    # type-check (svelte-check + tsc)
```

## Lesson 1 — Components & thinking in components

- [`docs/design.md`](./docs/design.md) — the design spec for the site: what we're building,
  why, grounded in the interview transcripts.
- [`docs/assignment-1.md`](./docs/assignment-1.md) — the assignment: refactor the monolithic
  [`src/App.svelte`](./src/App.svelte) homepage into a proper component structure.

## Project structure

```text
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
    components/
      atoms/          # Button, Badge, NavLink, ...
      molecules/      # ServiceCard, AppointmentTypeSelect, ...
      organisms/      # SiteHeader, ServicesSection, ...
docs/
  design.md          # design spec for the site
  assignment-1.md     # Lesson 1 assignment
  screenshots/        # reference renders of the approved design
  submissions/         # reference solution + student submissions
```

> This branch was migrated from a plain Vite+Svelte app to SvelteKit to get real file-based
> routing (`src/routes/`). The Lesson 1 docs (`docs/assignment-1.md`,
> `docs/submissions/reference-solution-notes.md`) still refer to `src/App.svelte`, which was
> this branch's page component at the time — that file no longer exists here; its content now
> lives in `src/routes/+page.svelte`. See git history for the original.
>
> This is the `solution/lesson-1` reference branch — the homepage is already componentized.
> See `docs/submissions/reference-solution-notes.md` for the reasoning behind the boundaries
> drawn. The student-facing starting point (one monolithic `App.svelte`, pre-SvelteKit) is on
> `main`.
