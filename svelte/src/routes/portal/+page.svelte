<script lang="ts">
  import SiteHeader from '$lib/components/organisms/SiteHeader.svelte';
  import PortalSection from '$lib/components/organisms/PortalSection.svelte';
  import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
  import { navLinks } from '$lib/data';
  import type { PageProps } from './$types';

  // email and pets come from the load function in +page.server.ts.
  let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-white text-slate-800">
  <SiteHeader links={navLinks} />
  <PortalSection email={data.email} pets={data.pets} />
  <SiteFooter links={navLinks} />
</div>
