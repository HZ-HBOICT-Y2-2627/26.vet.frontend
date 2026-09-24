# Assignment 3 — Sharing state between components

**Case:** Kliniek Van Dijk (see [`design.md`](./design.md))
**Stack:** SvelteKit + Svelte 5 + TypeScript + Tailwind CSS
**Format:** starts in the lesson, finishes as homework

## Context

The practice wants clients to book appointments online. The first piece of the booking page
([`/book-appointment`](../svelte/src/routes/book-appointment)) is simple: the client picks a vet
from a list, and a **summary panel** next to the list shows which vet they picked.

That sounds like one line of code, but it raises a question you'll run into in every frontend
app: *where does a piece of state live, and how do the components that need it get to it?* The
list of vets writes the selection; the summary reads it. As soon as those are different
components, you have to choose how they share it.

In this assignment you build the same feature four times, each time with a different answer to
that question. The user sees no difference between the four versions. The point is to feel what
each approach costs and what it gives you.

> Paths in this assignment start with `svelte/src/`. If your branch still has the app in the
> repository root, drop the `svelte/` prefix.

## Learning objectives

By the end of this assignment you can:

1. Create reactive state in a component with `$state` and explain why the markup updates when it
   changes.
2. Pass state down to a child component through props (one-directional data flow) and explain
   which component *owns* the state.
3. Share state between components through a `.svelte.ts` module, and explain why you change a
   *property* of the shared object instead of reassigning it.
4. Share state with Svelte's context API (`setContext` / `getContext`), and explain the difference
   between a module-level singleton and state scoped to one component tree.
5. Choose between these approaches for a given situation and argue why.

## Before you start

```bash
cd svelte
npm install
npm run dev
```

Open `/book-appointment` and read these files:

- [`BookingFormSection.svelte`](../svelte/src/lib/components/organisms/BookingFormSection.svelte):
  the booking section with the list of vets and the summary panel.
- [`VetCard.svelte`](../svelte/src/lib/components/molecules/VetCard.svelte): the card that shows
  one vet. It is also used by `TeamSection` on the homepage.
- [`data.ts`](../svelte/src/lib/data.ts): the `Vet` interface.

Commit after every step, so you can compare the versions afterwards.

---

## Step 1 — Local component state

### Background

The simplest place for state is the component that uses it. If one component both *writes* a
value (on a click) and *reads* it (in its markup), that value can just be a variable in that
component:

```ts
let selectedVet = $state<Vet | null>(null);
```

`$state` is a **rune**: it tells Svelte "this variable is reactive". When you assign a new value,
Svelte re-renders every part of the markup that reads it. A normal `let` wouldn't do that: the
value would change, but the screen wouldn't.

The type `Vet | null` says: either a vet is selected, or nothing is selected yet. The `null`
forces you to handle the "nothing selected" case in the markup.

### Your task

In `BookingFormSection.svelte`:

1. Add a `selectedVet` variable with `$state`, next to the `vets` prop.
2. Render every vet with `VetCard` inside a `<button type="button">`. When a card is clicked, set
   `selectedVet` to that vet (`onclick={() => (selectedVet = vet)}`).
3. In the summary panel, use `{#if}` to show the selected vet's name, or *"No vet selected yet."*
   when there is none.

**Check:** clicking a vet updates the summary immediately.

---

## Step 2 — Pass data down through props

### Background

The summary panel will grow (appointment type, date, timeslot…), so it deserves its own
component. Once it's a separate component, it can no longer see `selectedVet`, which is a
variable in *another* component. The most direct fix is to **pass it down as a prop**.

This is **one-directional data flow**:

- `BookingFormSection` **owns** the state. It is the only one that changes it.
- `AppointmentSummary` only **receives** it and renders it. It has no state of its own. A
  component like this is called *presentational*.

Data flows down (parent → child) through props. The child never changes a prop. If it
needs to, the state probably belongs somewhere else.

### Your task

1. Create `svelte/src/lib/components/molecules/AppointmentSummary.svelte` with one prop,
   `selectedVet: Vet | null`, typed with an `interface Props` and `$props()`.
2. Move the summary markup (the heading and the `{#if}` block) from `BookingFormSection` into it.
3. In `BookingFormSection`, keep `selectedVet` and the click handlers, and render
   `<AppointmentSummary {selectedVet} />` in the summary panel.

**Check:** the page behaves exactly as in step 1.

---

## Step 3 — Shared state in a module

### Background

Props work well for one level. But imagine the summary is three components deeper, or the date
picker in a sibling component also needs `selectedVet`. You would pass the same prop through
components that don't use it themselves ("prop drilling").

An alternative: put the state in its own file, and let every component that needs it
**import** it. Runes normally only work inside `.svelte` files, but a file ending in
**`.svelte.ts`** may use them too:

```ts
// svelte/src/lib/state/booking-state.svelte.ts
export const bookingState = $state<{ selectedVet: Vet | null }>({ selectedVet: null });
```

Note two things:

- The state is an **object** with a `selectedVet` property, not a plain `Vet | null`. You can't
  reassign an imported variable (`bookingState = vet` is an error outside its own module), but
  you *can* change a property of the object it points to: `bookingState.selectedVet = vet`.
  Svelte tracks that change, because `$state` makes the whole object reactive.
- Neither component knows about the other anymore. They don't pass anything to each other.
  They both point at the same object.

> **Where does the click handler go?** You might be tempted to put the `onclick` inside
> `VetCard` and import `bookingState` there. Don't. `VetCard` is also used by `TeamSection` on
> the homepage, just to *show* a vet. If `VetCard` imported `bookingState`, clicking a vet on the
> homepage would silently change the booking state as well. That's a bug. Keep the
> click handler in the booking-specific parent, so `VetCard` stays reusable and knows nothing
> about booking.

### Your task

1. In `svelte/src/lib/state/booking-state.svelte.ts`, export a `bookingState` object created with
   `$state`, as shown above.
2. `AppointmentSummary` no longer takes a prop. It imports `bookingState` and reads
   `bookingState.selectedVet`.
3. `BookingFormSection` removes its own `selectedVet` state. The click handler writes to
   `bookingState.selectedVet`, and `<AppointmentSummary />` is rendered without props.

**Check:** the page still behaves the same. Now navigate to the homepage and back. Is the
selected vet still there? Why?

---

## Step 4 — Context instead of a module singleton

### Background

The `bookingState` from step 3 is a **singleton**: the object is created once, when the module is
first loaded, and every component that imports it gets that same object. That hides a problem:

- If `BookingFormSection` were ever rendered twice on one page, both would share the same
  `selectedVet`. Selecting a vet in one would also change the other.
- In SvelteKit the page is also rendered **on the server**. A module-level object on the server is
  shared by *every request*, so every visitor. For a selected vet that's mostly harmless, but for
  anything personal it's a real leak.

**Context** solves this. A component calls `setContext(key, value)` to make a value available to
everything rendered *inside* it. Any component further down the tree calls `getContext(key)` to
get it. Svelte looks up the tree for the nearest ancestor that set that key. Every time
`BookingFormSection` is created, it creates a *fresh* state object and scopes it to its own
subtree.

Instead of calling `setContext`/`getContext` with a raw string key everywhere, wrap them in small
helper functions in `booking-state.svelte.ts`:

```ts
export function createBookingState(): BookingState { /* returns a new $state object */ }
export function setBookingContext(state: BookingState) { /* setContext(...) */ }
export function getBookingContext(): BookingState { /* return getContext(...) */ }
```

This keeps the key in one place and gives callers a proper return type instead of a cast.

Three things to know:

- `createBookingState()` is a **factory**: it returns a *new* `$state` object each time it's
  called. `$state` works inside a function in a `.svelte.ts` file, as long as the function is
  called while a component is being initialized (from its `<script>`).
- `$state(...)` may only appear as the initial value of a variable declaration. `return
  $state(...)` is a compile error. Write `const state = $state(...)` first, then
  `return state`.
- `getContext` only works while a component is being initialized, so call it at the top level
  of `<script>`, not inside a click handler.

### Your task

1. In `booking-state.svelte.ts`, replace the exported singleton with an `interface BookingState`,
   a context key, and the three functions above.
2. In `BookingFormSection`, create the state with `createBookingState()`, pass it to
   `setBookingContext(...)`, and let the click handler write to it.
3. In `AppointmentSummary`, get the state with `getBookingContext()` instead of importing an
   object.

**Check:** the page still behaves the same. Now navigate to the homepage and back again. What
changed compared to step 3, and why?

---

## Comparing the four approaches

| | 1. Local state | 2. Props | 3. Module state | 4. Context |
| --- | --- | --- | --- | --- |
| **Who can read it** | only that component | the component and children it passes it to | any component that imports it | any component inside the one that set it |
| **How many copies** | one per component instance | one per owner instance | one for the whole app (and on the server, for all visitors) | one per component that sets it |
| **Visible in the code** | yes, in one file | yes, every prop is explicit | hidden: any file can import and change it | half: you see `getBookingContext()`, not who set it |
| **Reusable child components** | n/a | yes, the child works with any data | no, the child is tied to that module | only inside a parent that sets the context |
| **Good fit for** | state used by one component | a parent and its direct children | truly app-wide state that is the same for everyone | state shared by a part of the page |

**Rule of thumb.** Start with local state. Pass it down with props when a child needs it. Reach
for context when props have to travel through components that don't use them. Use module state
only for things that really are one-per-app, and never for per-user data in a SvelteKit app.

---

## Constraints

- **TypeScript everywhere, no `any`.** Props use an `interface Props`. The state has a type
  (`Vet | null` / `BookingState`). `npm run check` must be clean.
- **`VetCard` stays unaware of booking.** It doesn't import any booking state and still works
  unchanged in `TeamSection`.
- **No visual difference between the steps.** Only the code changes.

## Deliverables

1. A branch/PR (or the submission method your instructor specifies) with **one commit per step**,
   ending in the context version from step 4.
2. In `docs/submissions/<your-names>-assignment-3.md`, a short reflection (10–15 lines) answering:
   - In step 3, why is the selected vet still there after you visit the homepage and come back,
     and why isn't it in step 4?
   - Why must the click handler stay in `BookingFormSection` and not move into `VetCard`?
   - The booking form will get an appointment type, a date and a timeslot. Which approach would
     you use for those, and why? Use at least two rows of the comparison table.

## Stretch goals (optional)

- **Two forms, one page.** Temporarily render `<BookingFormSection {vets} />` twice on the
  booking page. Try it with the step 3 version and with the step 4 version, and describe the
  difference.
- **Show that a vet is selected.** Highlight the selected card in the list (for example with a
  ring or border). Where does that styling decision belong: in `VetCard`, or in the parent?
- **Appointment type.** Add `selectedAppointmentType` to `BookingState` and show it in the
  summary as well.
