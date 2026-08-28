<script lang="ts">
  import type { NavLink as NavLinkData } from '../../data';
  import { emergencyPhone } from '../../data';
  import NavLink from '../atoms/NavLink.svelte';
  import Button from '../atoms/Button.svelte';

  interface Props {
    links: NavLinkData[];
  }

  let { links }: Props = $props();

  let mobileNavOpen = $state(false);
</script>

<!-- Top bar: emergency + phone, always visible for the "just let me call someone" client segment -->
<div class="bg-primary-800 text-primary-50 text-sm">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
    <p>🚨 Animal emergency? Call us directly: <a href={emergencyPhone.href} class="font-semibold underline">{emergencyPhone.display}</a></p>
    <p class="hidden sm:block">Mon–Fri 08:30–18:00 · Sat 09:00–13:00</p>
  </div>
</div>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
    <a href="#home" class="flex items-center gap-2 text-lg font-bold text-primary-700">
      <span class="text-2xl">🐾</span>
      Kliniek Van Dijk
    </a>

    <nav class="hidden items-center gap-6 md:flex">
      {#each links as link}
        <NavLink href={link.href} label={link.label} variant="desktop" />
      {/each}
    </nav>

    <div class="hidden md:inline-block">
      <Button href="#book" size="sm">Book appointment</Button>
    </div>

    <button
      class="text-2xl md:hidden"
      aria-label="Toggle navigation menu"
      onclick={() => (mobileNavOpen = !mobileNavOpen)}
    >
      {mobileNavOpen ? '✕' : '☰'}
    </button>
  </div>

  {#if mobileNavOpen}
    <nav class="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
      {#each links as link}
        <NavLink
          href={link.href}
          label={link.label}
          variant="mobile"
          onclick={() => (mobileNavOpen = false)}
        />
      {/each}
    </nav>
  {/if}
</header>
