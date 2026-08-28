# Assignment 1 — Thinking in components

**Case:** Kliniek Van Dijk (see [`design.md`](./design.md))
**Stack:** Svelte 5 + TypeScript + Tailwind CSS
**Format:** starts in the lesson, finishes as homework

## Context

The practice approved the design in [`design.md`](./design.md). Someone already built it — to
hit a deadline, they put the entire homepage in a single file: [`src/App.svelte`](../src/App.svelte).
It works, it matches the design pixel-for-pixel, and `npm run build` is clean. But it's one
457-line file with no reuse, which is a problem the moment anyone needs to:

- build the Services or Team *detail* pages, which need the same cards again,
- change what a button looks like everywhere at once, or
- have two people work on the same page without stepping on each other.

Your job is not to change what the user sees. It's to reorganize the file into components —
the same output, produced by composing smaller pieces instead of one large one.

## Learning objectives

By the end of this assignment you can:

1. Explain what a frontend framework's component model gives you that plain HTML/CSS/JS
   doesn't (composition, encapsulation, reuse, a single source of truth for a piece of UI).
2. Look at a rendered UI and a monolithic implementation, and identify sensible component
   boundaries — using the **atoms → molecules → organisms** vocabulary as a thinking tool, not
   a rulebook.
3. Write a Svelte component with typed props (`interface` + `$props()`), including array/list
   props rendered with `{#each}`.
4. Judge when *not* to extract a component (over-fragmenting a UI is also a design mistake).

## Before you start

```bash
npm install
npm run dev
```

Open the running site and open [`src/App.svelte`](../src/App.svelte) side by side. Also read
[`design.md`](./design.md) — you'll need the reasoning behind a few decisions (e.g. why the
duration badge exists) to judge what a component's *responsibility* should be, not just where
the `<div>` tags happen to fall.

New to Svelte? Read [`svelte-component-basics.md`](./svelte-component-basics.md) first — a
short translation guide from general programming knowledge to Svelte's specific syntax
(props, `{#each}`/`{#if}`, and just enough of a preview of `$state`/`$derived` to get through
this assignment before we cover reactivity properly next lesson).

---

## Part A — In class: find the components (no code yet)

Work in pairs. Don't open an editor for this part — use paper, a whiteboard, or a shared
FigJam/Miro board.

1. Go through the rendered homepage section by section (top bar → footer) and list every
   place you see the **same shape repeated with different content** (e.g. the six service
   cards, the four vet cards, the two testimonials) or the **same small element reused**
   (e.g. every button, the pill-shaped duration badge).
2. For each candidate component, write down:
   - a name,
   - one sentence describing its responsibility,
   - what data it needs to receive from its parent to render (its *props*).
3. Arrange your candidates into a tree: which components contain which. Mark which ones are
   **atoms** (can't usefully be broken down further, e.g. a `Button`), **molecules** (a small
   group of atoms with one job, e.g. a `ServiceCard`), and **organisms** (a section made of
   molecules/atoms, e.g. the whole `ServicesSection`).
4. Sanity-check your tree against these questions:
   - If the practice adds a 7th service tomorrow, does anything other than a data array need
     to change?
   - Does any component know more about the rest of the page than it needs to (e.g. does your
     `ServiceCard` need to know it's inside a grid, or just that it renders one service)?

**Deliverable for Part A:** a photo or export of your component tree, added to
`docs/submissions/<your-names>-component-tree.png` (or `.md` if you'd rather write it as a
nested list). This is checked for participation, not correctness — there is more than one
reasonable tree.

## Part B — In class + homework: build it

Starting from your Part A tree (revise it if building reveals a better boundary — that's
normal), extract components into `src/lib/components/`. One `.svelte` file per component,
placed in a subfolder that matches the tier you assigned it in Part A:

```text
src/lib/components/
  atoms/        Button.svelte, Badge.svelte, NavLink.svelte, ...
  molecules/    ServiceCard.svelte, AppointmentTypeSelect.svelte, ...
  organisms/    SiteHeader.svelte, ServicesSection.svelte, ...
```

This isn't a Svelte convention — Svelte doesn't care where a file lives. It's a project
convention we're adopting *because* this lesson is specifically about the atomic-design
vocabulary: putting a component in `molecules/` forces you to commit to a classification
instead of leaving it implicit. When you genuinely can't decide which folder a component
belongs in, that's not a sign you're doing it wrong — it's usually a sign the component
itself is doing two things at once, which is worth noticing regardless of folder.

Don't over-invest in getting the tier "right." Plenty of real codebases skip this three-way
split entirely and use two buckets instead — a `ui/` folder for generic, reusable primitives
with no page/content knowledge, and everything else grouped by page or feature — precisely
because the atom-vs-molecule line is often debatable. Atomic design is a thinking tool for
this exercise, not a permanent architecture decision.

**Minimum required extractions** — your tree should end up including at least these, though
naming and exact prop shapes are your call:

| Component | Kind | Notes |
| --- | --- | --- |
| `Button` | atom | Used for every CTA on the page. Needs to support both the solid and outlined style seen in the design, and render as a link (`<a>`) since these are all navigation, not form submission. |
| `Badge` | atom | The small pill used for the service duration (e.g. "~15 min"). |
| `NavLink` | atom | One navigation link, used in the header, mobile menu, and footer. |
| `ServiceCard` | molecule | One service: icon, title, description, duration badge. |
| `VetCard` | molecule | One vet: initials avatar, name, role, bio. |
| `TestimonialCard` | molecule | One quote + author. |
| `AppointmentTypeSelect` | molecule | The visit-type dropdown *and* the derived duration text — keep this logic together, it's one interaction. |
| `SiteHeader` | organism | Top bar + nav + mobile menu toggle. |
| `SiteFooter` | organism | The footer, including its four columns. |

You are free to extract more (e.g. a `ServicesSection` organism that owns the `services` array
and lays out the `ServiceCard`s) — in fact for most of the page you should. The table above is
a floor, not the whole design.

### Constraints

- **TypeScript everywhere.** Every component's props must be a named `interface`, used with
  Svelte 5's `$props()` — no `any`, no untyped `export let`.
- **Tailwind only.** No new `<style>` blocks unless you have a concrete reason a utility class
  can't express (write that reason as a comment).
- **No visual regression.** Compare against `docs/screenshots/homepage-desktop.png` and
  `homepage-mobile.png`. If a change in spacing or color sneaks in while refactoring, that's a
  bug — file it as such (fix it) rather than treating it as an intentional redesign.
- **No new features.** Don't wire up real availability checking, a real login, or real form
  submission. The teaser interactions (dropdown → duration, date input, mobile menu toggle)
  should keep behaving exactly as they do now — same state, same logic, just relocated into
  the right component.
- **Accessibility travels with the markup.** If a component replaces an `<a>` or `<button>`
  with something else, or drops an `aria-label`/`alt`, that's a regression — see
  `design.md` §7.
- Where a component renders a list (services, vets, testimonials, nav links, opening hours),
  the array and its TypeScript type may live in the component that owns the data, or be moved
  to a shared `src/lib/data.ts` — your call, but be able to justify it.

### Suggested order (feel free to deviate)

1. Atoms first (`Button`, `Badge`, `NavLink`) — low risk, immediately reused.
2. `SiteHeader` and `SiteFooter` — self-contained, easy wins, no shared state with the rest of
   the page.
3. The three card molecules (`ServiceCard`, `VetCard`, `TestimonialCard`).
4. `AppointmentTypeSelect` last — it's the only piece with non-trivial reactive state
   (`$state`/`$derived`), so it benefits from the practice you'll have had by then.

## Deliverables

1. Your Part A component tree (see above).
2. A branch/PR (or the submission method your instructor specifies) containing:
   - the new files under `src/lib/components/`,
   - an updated `src/App.svelte` that composes those components instead of inlining markup,
   - a clean `npm run build` and `npm run check` (zero errors).
3. A short `docs/submissions/<your-names>-notes.md` (10–15 lines) answering:
   - Where did you draw a component boundary differently than your Part A sketch, and why?
   - Which component was the hardest to decide on, and what were the two options you were
     choosing between?

## Grading rubric

| Criterion | Weight |
| --- | --- |
| Component boundaries are sensible (single responsibility, reasonable reuse) | 30% |
| TypeScript props are correctly typed and used idiomatically (`$props()`, no `any`) | 20% |
| No visual or behavioral regression vs. the original page | 20% |
| Code organization & naming (file structure, consistent naming, no dead code left behind) | 15% |
| Reflection notes show genuine reasoning, not just a description of what was done | 15% |

## Stretch goals (optional)

For students who finish early:

- Make `Button` accept a `variant` prop (`"solid" | "outline"`) instead of two separate
  components, and think about what that trade-off buys or costs you.
- Give `AppointmentTypeSelect` a generic-ish reusable `Select<T>`-style atom underneath it.
- Extract `services`, `vets`, `testimonials`, `openingHours` and their TypeScript interfaces
  into `src/lib/data.ts`, imported by both the components and (in your head, for now) a future
  Services/Team page — this is genuine prep for the next lesson.
- Write one sentence per component as a comment explaining *why* it exists as a separate
  component (not what it renders) — good practice for when a reviewer asks "why is this its
  own component?"
