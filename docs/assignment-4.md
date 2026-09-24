# Assignment 4 — Loading data from a service

**Case:** Kliniek Van Dijk (see [`design.md`](./design.md))
**Stack:** SvelteKit + Svelte 5 + TypeScript, ExpressJS service in [`services/vets_service`](../services/vets_service)
**Format:** starts in the lesson, finishes as homework

## Context

Until now, all content on the site came from a hard-coded file:
[`svelte/src/lib/data.ts`](../svelte/src/lib/data.ts). That was fine for building components, but
the practice wants to manage its treatments, vets and appointment types itself, without asking a
developer to edit a TypeScript file. That data now lives in a database behind an ExpressJS
service, the **vets service**, which runs on `http://localhost:4000`:

| Endpoint | Returns |
| --- | --- |
| `GET /treatments` | all treatments (the "What we treat" cards) |
| `GET /vets` | all vets |
| `GET /appointment-types` | all appointment types |

The booking page ([`/book-appointment`](../svelte/src/routes/book-appointment)) already loads its
data from this service, and does it in **two different ways on purpose**:

- the **vets** are loaded by the **page**, on the server, before anything is rendered;
- the **appointment types** are loaded by a **component**, in the browser, after it appears on
  screen.

Both work. They are not equally good for every situation, though. In this assignment you'll
study both approaches, use each one yourself on the homepage, and learn to argue *where* data
should be loaded — and how to keep TypeScript honest about data that comes from outside your app.

## Learning objectives

By the end of this assignment you can:

1. Load data for a page in a SvelteKit `load` function (`+page.server.ts`) and use it in the page
   through `data`.
2. Load data inside a component with `onMount`, including the loading and error states that come
   with it.
3. Explain the consequences of each choice: what the user sees first, where the code runs, what
   happens when the service is down, and how reusable the component is.
4. Type data from an API correctly: write an `interface` that matches the API, use SvelteKit's
   generated types (`PageServerLoad`, `PageProps`), and explain why a type annotation on
   `response.json()` is a promise, not a check.

## Before you start

You need two terminals: one for the service and one for the Svelte app.

```bash
# Terminal 1 — the vets service (first time: see its README for the database setup)
cd services/vets_service
npm install
npm run dev              # runs on http://localhost:4000

# Terminal 2 — the Svelte app
cd svelte
cp .env.example .env     # first time only
npm install
npm run dev
```

Check that the service works by opening <http://localhost:4000/treatments> in your browser. You
should see JSON.

The `.env` file contains the service URL twice:

```env
VET_SERVICE_API_URL=http://localhost:4000
PUBLIC_VET_SERVICE_API_URL=http://localhost:4000
```

SvelteKit only sends variables starting with `PUBLIC_` to the browser. Code that runs on the
server imports from `$env/static/private`; code that runs in the browser can only import from
`$env/static/public`. You'll need both in this assignment.

---

## Background — two places to load data

### 1. In the page: a `load` function

A route can have a `+page.server.ts` file next to its `+page.svelte`. SvelteKit calls its `load`
function **on the server, before the page is rendered**, and hands the result to the page as
`data`. See [`book-appointment/+page.server.ts`](../svelte/src/routes/book-appointment/+page.server.ts):

```ts
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch(`${VET_SERVICE_API_URL}/vets`);

  if (!response.ok) {
    error(503, 'Could not load the vets. Is the vets service running?');
  }

  const vets: Vet[] = await response.json();
  return { vets };
};
```

The page receives it and passes it down as a prop, like any other data
([`book-appointment/+page.svelte`](../svelte/src/routes/book-appointment/+page.svelte)):

```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<BookingFormSection vets={data.vets} />
```

### 2. In a component: `onMount`

A component can also fetch its own data. `onMount` runs **once, in the browser, after the
component is on the screen**. See
[`AppointmentTypeSelect.svelte`](../svelte/src/lib/components/molecules/AppointmentTypeSelect.svelte):

```ts
let types: AppointmentType[] = $state([]);
let loading = $state(true);
let errorMessage = $state('');

onMount(async () => {
  try {
    const response = await fetch(`${PUBLIC_VET_SERVICE_API_URL}/appointment-types`);
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
    types = await response.json();
  } catch {
    errorMessage = 'Could not load the appointment types.';
  } finally {
    loading = false;
  }
});
```

Notice how much more the component has to take care of itself: a loading state, an error state,
and the markup for both (`{#if loading} … {:else if errorMessage} … {:else} … {/if}`).

> **Why `onMount` and not `$effect`?** `$effect` re-runs every time a value it reads changes,
> which makes it easy to create a request loop by accident. The Svelte docs recommend against
> using it for fetching. `onMount` says exactly what we mean: *once, in the browser, after
> mounting*. Newer Svelte features (`await` directly in components, SvelteKit remote functions)
> will make this nicer, but they are still experimental at the time of writing.

---

## Design considerations — where should data be loaded?

There is no single right answer, but there are consequences you should be able to name.

| | Page (`load` in `+page.server.ts`) | Component (`onMount`) |
| --- | --- | --- |
| **Runs** | on the server, before rendering | in the browser, after the component appears |
| **First thing the user sees** | the complete content | a loading state, then the content |
| **In "View page source"** (search engines, slow devices) | yes | no |
| **Loading & error states** | handled by SvelteKit (the page waits; errors go to the error page) | you write them yourself, in every component |
| **If the service is down** | the whole page fails | only that component shows an error |
| **Service URL** | stays on the server (`$env/static/private`) | visible to everyone (`PUBLIC_…`), and the service must allow CORS |
| **Several requests** | can run at the same time with `Promise.all` | each component starts only after it is rendered, which can create a chain of waiting ("waterfall") |
| **Reuse of the component** | the component only renders what it gets, so it works with any data (also test data) | the component works on any page without setup, but is tied to that one endpoint |
| **"Which requests does this page make?"** | one file tells you | spread across components |

**Rule of thumb.** Load in the **page** when the data is needed for the first render or by
several components. Load in a **component** when the data is secondary or optional, only needed
after a user action (e.g. timeslots after picking a date), or when the component must work on
its own anywhere.

---

## Working with types

Data from a service enters your app as JSON. TypeScript cannot see what's inside it, so you have
to tell it — carefully.

1. **Write an `interface` that matches what the API actually returns.** Open the endpoint in
   your browser and compare it field by field with the interface in `data.ts`. The service
   returns an `id` for every record, for example, which the hard-coded data didn't have. When we
   connected the booking page, `Vet` got an `id: number`, and `AppointmentType` changed from
   `id: string` (`'vaccination'`) to `id: number` plus a `slug: string`, because that's what the
   service sends.
2. **`response.json()` returns `any`.** Writing `const vets: Vet[] = await response.json()` is a
   *promise* to TypeScript, not a *check*. If the API sends something else, TypeScript won't
   notice — your app will break at runtime instead. That's why step 1 matters.
3. **Let SvelteKit carry the type from `load` to the page.** Type the load function with
   `PageServerLoad` and the page props with `PageProps`, both imported from `./$types`. SvelteKit
   generates these per route. `data.vets` is then automatically a `Vet[]` in the page, and you
   never write that type twice.
4. **Use `error()` instead of returning an error object.** Returning `{ error }` from `load`
   makes `data` either `{ vets }` or `{ error }`, and the page has to check which one it got.
   `error(503, '…')` stops the load and shows SvelteKit's error page, so `data.vets` is always a
   `Vet[]`.
5. **No `any`.** Also not in helper functions or callback parameters. `npm run check` must be
   clean.

The service has its own copy of these types in
[`services/vets_service/src/types/index.ts`](../services/vets_service/src/types/index.ts). For now
we keep a separate copy in the frontend and keep them in sync by hand. Think about what could go
wrong with that — it's one of the reflection questions.

---

## Part A — In class: study the booking page (no code yet)

Work in pairs. Start both the service and the Svelte app, and open `/book-appointment`.

1. Read [`+page.server.ts`](../svelte/src/routes/book-appointment/+page.server.ts) and
   [`AppointmentTypeSelect.svelte`](../svelte/src/lib/components/molecules/AppointmentTypeSelect.svelte).
   For both, write down: *where* does the code run, and *when*?
2. Run these experiments and write down what you see:
   1. Right-click → **View page source**. Search for a vet's name, then for "Vaccination".
      Which one is in the HTML, and why?
   2. In DevTools → Network, set throttling to **Slow 4G** and reload. What appears first?
   3. In DevTools → Network, find the request to `/appointment-types`. Why is there no request
      to `/vets`?
   4. Stop the vets service and reload. What happens to the page? Start it again, then right-click
      the `/appointment-types` request → **Block request URL**, and reload. What happens now?
3. Follow a vet from the database to the screen: which files does it pass through, and what is
   its type in each of them?

**Deliverable for Part A:** your answers in `docs/submissions/<your-names>-assignment-4.md`.

## Part B — Load the treatments in the page

The "What we treat" section on the homepage still uses the hard-coded `services` from `data.ts`.
Load them from `GET /treatments` instead, **using a `load` function**.

1. Compare the JSON from <http://localhost:4000/treatments> with the `Service` interface in
   `data.ts`. Update the interface so it matches the API. (Is `Service` still a good name when the
   endpoint calls them *treatments*? Decide, and be ready to explain.)
2. Create `svelte/src/routes/+page.server.ts` with a `load` function, typed with
   `PageServerLoad`, that fetches the treatments and returns them.
3. In `svelte/src/routes/+page.svelte`, receive `data` with `PageProps` and pass the treatments to
   `ServicesSection`.
4. Remove the hard-coded `services` array from `data.ts` once nothing uses it anymore.
5. Stop the service and check that you get a clear error, not a crash with a confusing message.

`ServicesSection` and `ServiceCard` should not need to change beyond their types. If they do, ask
yourself why.

## Part C — Load the team in a component

Now do the opposite for the "Meet the team" section: let **`TeamSection` load the vets itself**,
from `GET /vets`, using `onMount`.

1. Remove the `vets` prop from `TeamSection` and fetch the vets in the component instead.
2. Add a loading state and an error state that fit the design (look at how
   `AppointmentTypeSelect` does it, but make the messages suit this section).
3. The homepage no longer passes `vets` to `TeamSection`. Remove what's no longer needed.
4. Repeat the experiments from Part A on the homepage. What changed for the team section?

This part is deliberately a debatable choice. You will be asked whether you'd keep it.

### Constraints

- **TypeScript everywhere, no `any`.** Interfaces match the API. `npm run check` and
  `npm run build` are clean.
- **Use the right environment variable in the right place:** private in `+page.server.ts`,
  `PUBLIC_…` in components.
- **No visual regression when everything works.** With the service running, the homepage looks
  the same as before (compare with `docs/screenshots/`).
- **Components stay presentational where you didn't choose otherwise.** Only `TeamSection` (and
  the existing `AppointmentTypeSelect`) fetch data; all other components get data through props.

## Deliverables

1. Your Part A answers (see above).
2. A branch/PR (or the submission method your instructor specifies) containing:
   - `svelte/src/routes/+page.server.ts` and the updated homepage (Part B),
   - the updated `TeamSection` (Part C),
   - updated interfaces in `data.ts`, and no leftover hard-coded data that nothing uses,
   - a clean `npm run check` and `npm run build`.
3. In the same `docs/submissions/<your-names>-assignment-4.md`, a short reflection (15–20 lines)
   answering:
   - Would you keep the team section loading in the component, or move it to the page? Argue
     using at least three rows from the design considerations table.
   - Give one example on this site (existing or future) where loading in a component is clearly
     the better choice, and explain why.
   - The frontend and the service each have their own `Vet` interface. What could go wrong, and
     how would you notice?

## Grading rubric

| Criterion | Weight |
| --- | --- |
| Page `load` works and is typed correctly (`PageServerLoad`, `PageProps`, `error()`) | 25% |
| Component fetch works, with sensible loading and error states | 20% |
| Interfaces match the API; no `any`; `npm run check` is clean | 20% |
| Reflection shows genuine reasoning about the trade-offs, not a description of the code | 25% |
| Code organization (right env variables, no dead code, components stay presentational) | 10% |

## Stretch goals (optional)

For students who finish early:

- **Service down, friendly page.** When the service isn't running at all, `fetch` in `load` throws
  before there is a response, and SvelteKit shows a generic "Internal Error". Catch that case and
  turn it into the same `error(503, …)` message.
- **Load in parallel.** Let the homepage `load` fetch treatments *and* vets at the same time with
  `Promise.all`, and compare the timing in the Network tab with the Part C version.
- **Data that depends on a choice.** On the booking page, load timeslots only after the user
  picks a date. Which approach fits here, and why is `onMount` no longer enough on its own?
- **Check instead of promise.** Validate the API response at runtime with a schema library such
  as [zod](https://zod.dev) (the service already uses it in `src/validation`), so a mismatch
  between API and interface gives a clear error instead of a broken page.
