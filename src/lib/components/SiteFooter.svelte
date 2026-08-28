<script lang="ts">
  import type { NavLink as NavLinkData } from '../data';
  import { emergencyPhone } from '../data';
  import NavLink from './NavLink.svelte';

  interface Props {
    links: NavLinkData[];
  }

  let { links }: Props = $props();
</script>

<footer id="contact" class="bg-slate-900 py-12 text-slate-300">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
    <div>
      <p class="flex items-center gap-2 text-lg font-bold text-white">
        <span class="text-2xl">🐾</span>
        Kliniek Van Dijk
      </p>
      <p class="mt-3 text-sm">Caring for companion animals since 2008.</p>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-white">Navigate</h3>
      <ul class="mt-3 space-y-2 text-sm">
        {#each links as link}
          <li><NavLink href={link.href} label={link.label} variant="footer" /></li>
        {/each}
      </ul>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-white">Contact</h3>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a href={emergencyPhone.href} class="hover:text-white">{emergencyPhone.display}</a></li>
        <li><a href="mailto:info@kliniekvandijk.nl" class="hover:text-white">info@kliniekvandijk.nl</a></li>
        <li>Dorpsstraat 42, Middelburg</li>
      </ul>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-white">Privacy</h3>
      <p class="mt-3 text-sm">
        We handle your data under the GDPR/AVG. Read our
        <a href="#privacy-policy" class="underline hover:text-white">privacy policy</a> to see who can access
        your information.
      </p>
    </div>
  </div>

  <p class="mt-10 text-center text-xs text-slate-500">
    © 2026 Kliniek Van Dijk. All rights reserved.
  </p>
</footer>
