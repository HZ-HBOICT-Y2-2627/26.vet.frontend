# Kliniek Van Dijk — frontend course material

Course material and assignments for the frontend lessons built around a single running case:
a public website for a fictional veterinary practice, **Kliniek Van Dijk**. The case is based
on the stakeholder interviews in
[HZ-HBOICT-UVE-2627/veterinarian-case](https://github.com/HZ-HBOICT-UVE-2627/veterinarian-case).

Each lesson builds on the same codebase, so by the end of the course you'll have iterated on
one real (if fictional) product rather than a series of disconnected exercises.

## Tech stack

- [Svelte 5](https://svelte.dev/) (runes: `$state`, `$derived`, `$props()`)
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
  App.svelte        # homepage — composed from components, see Assignment 1
  app.css           # Tailwind import + design tokens (colors, fonts)
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

> This is the `solution/lesson-1` reference branch — `src/App.svelte` here is already
> componentized. See `docs/submissions/reference-solution-notes.md` for the reasoning behind
> the boundaries drawn. The student-facing starting point (one monolithic `App.svelte`) is on
> `main`.
