# Svelte component basics

You already know how to program — this is a translation guide from "general programming
knowledge" to "Svelte specifically," covering the minimum you need for
[Assignment 1](./assignment-1.md). It is not a full Svelte course. For that, Svelte's own
interactive tutorial ([svelte.dev/tutorial](https://svelte.dev/tutorial)) is excellent and
worth doing properly at some point — just not a blocker for getting started here.

This project uses **Svelte 5**. If you search for Svelte help online and find something using
`export let` or `on:click`, that's Svelte 4 syntax. It still exists, but everything in this
codebase uses the Svelte 5 style shown below.

## 1. The anatomy of a `.svelte` file

A component file has up to three parts. This course only uses two of them:

```svelte
<script lang="ts">
  // TypeScript: props, small bits of logic. Runs once per component instance.
</script>

<!-- HTML-like markup, with some extra syntax for dynamic content. -->
```

The third part, a `<style>` block for component-scoped CSS, exists but we don't use it —
Tailwind's utility classes go straight into the markup's `class="..."` attributes instead, so
you won't see a `<style>` block anywhere in this codebase.

A component's filename is its name: `Button.svelte` is used elsewhere as `<Button ... />`. By
convention the filename is PascalCase, matching the tag name.

## 2. Props: how a component receives data

Every component that needs input declares its props as a TypeScript `interface`, then reads
them with `$props()`:

```svelte
<script lang="ts">
  interface Props {
    name: string;
  }

  let { name }: Props = $props();
</script>

<p>Hello, {name}!</p>
```

Used from a parent as `<Greeting name="Robin" />`.

`$props()` is one of a small family of Svelte functions with a `$` prefix, called **runes**.
There's more to runes than this (we'll get to `$state` and `$derived` properly in the next
lesson) — for now, treat `$props()` as fixed syntax that means "this is how a component reads
what its parent passed it," and move on.

**Optional props with a default** work like normal TypeScript/JS defaults:

```ts
interface Props {
  size?: 'sm' | 'md';
}

let { size = 'md' }: Props = $props();
```

**Passing props from a parent** looks like an HTML attribute:

```svelte
<ServiceCard service={someService} />
```

If the variable name matches the prop name exactly, Svelte has a shorthand you'll see
constantly in this codebase:

```svelte
<ServiceCard {service} />
```

That's identical to `service={service}` — it's not a special "pass the whole object" syntax,
just a shortcut for the common case where the variable and the prop share a name.

## 3. Showing data in markup

- `{expression}` — drop any JS/TS expression into markup as text: `<p>{service.title}</p>`.
- `{#each items as item}...{/each}` — loop over an array:

  ```svelte
  {#each services as service}
    <ServiceCard {service} />
  {/each}
  ```

- `{#if condition}...{:else}...{/if}` — conditional rendering:

  ```svelte
  {#if mobileNavOpen}
    <nav>...</nav>
  {/if}
  ```

- Attributes can mix static text and an expression: `class="rounded-full {sizeClasses[size]}"`.

## 4. Handling clicks and other events

```svelte
<button onclick={() => (mobileNavOpen = !mobileNavOpen)}>Menu</button>
```

Note this is a plain-looking attribute (`onclick`, no colon) — Svelte 4's `on:click` syntax
still works but isn't used here.

## 5. Lookup objects for variant styling

You'll see this pattern in `Button.svelte` and `NavLink.svelte`: a component that renders
differently depending on a `variant` prop uses a plain object as a lookup table instead of an
`if`/`else if`/`else` chain:

```ts
type Variant = 'solid' | 'outline';

interface Props {
  variant?: Variant;
}

let { variant = 'solid' }: Props = $props();

const variantClasses = {
  solid: 'bg-primary-600 text-white',
  outline: 'border border-primary-600 text-primary-700',
};
```

```svelte
<a class={variantClasses[variant]}>...</a>
```

Because `variant`'s type (`Variant`) lists exactly the same options as the keys of
`variantClasses`, TypeScript can check `variantClasses[variant]` is always valid — no runtime
`if` needed, and no risk of a typo in one of the branches silently doing nothing.

## 6. What about content between a component's tags?

You may wonder why every component here takes its text via a prop —
`<Button label="Book now" href="#book" />` — instead of the more HTML-like
`<Button href="#book">Book now</Button>`.

Svelte does support the second style (it's called passing **children**, and Svelte 5
implements it with something called a **snippet**), but it's an extra concept on top of
everything above, and every piece of button/badge text in this design happens to be plain
text — so this codebase sidesteps it for now with a plain `label`/`text` prop instead. If
you're curious, Svelte's docs cover snippets and children under "Svelte > Template syntax" —
not required for Assignment 1.

## 7. A preview: components that remember something (`$state`, `$derived`)

Almost every component you'll build for Assignment 1 is "dumb": given some props, it renders
markup, and that's it. No memory, no interactivity.

**One** component is different: the appointment-type dropdown needs to remember which option
is currently selected, and recompute the displayed duration whenever that changes. Svelte
handles this with two more runes:

```svelte
<script lang="ts">
  let count = $state(0);
  const doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{count}</button>
<p>Doubled: {doubled}</p>
```

- `$state(0)` declares a value Svelte actively watches — whenever it changes, everything that
  reads it re-renders automatically.
- `$derived(...)` declares a value computed from other reactive values, kept automatically in
  sync — you never manually "update" `doubled`, Svelte does it whenever `count` changes.

We'll properly cover runes and reactivity in the next lesson. For Assignment 1, if you reach
`AppointmentTypeSelect`, it's fine to treat its `$state`/`$derived` lines as "this is how
Svelte remembers things" without understanding every rule behind them yet — the assignment
deliberately puts this component last for that reason. (You'll also spot one `untrack(...)`
call there, with a comment explaining it — that's a minor escape hatch for one specific
warning, not something you need to reuse elsewhere.)

## Quick reference

| You want to... | Syntax |
| --- | --- |
| Receive data from a parent | `interface Props { x: T }` + `let { x }: Props = $props();` |
| Pass data to a child | `<Child x={value} />`, or `<Child {x} />` if names match |
| Render a value | `{expression}` |
| Loop over a list | `{#each items as item}...{/each}` |
| Render conditionally | `{#if cond}...{:else}...{/if}` |
| Handle a click | `onclick={() => ...}` |
| Pick styles by variant | a plain object used as a lookup table, see §5 |
| Remember something across re-renders (later lesson) | `$state(...)`, `$derived(...)` |
