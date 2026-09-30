<script lang="ts">
  import SiteHeader from '$lib/components/organisms/SiteHeader.svelte';
  import PortalSection from '$lib/components/organisms/PortalSection.svelte';
  import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
  // Dummy data for now. In Assignment 5 this page gets a login and loads the
  // real pets of the logged-in user from GET /my/pets.
  import { navLinks, portalEmail, pets } from '$lib/data';
</script>

<div class="min-h-screen bg-white text-slate-800">
  <SiteHeader links={navLinks} />
  <PortalSection email={portalEmail} {pets} />
  <SiteFooter links={navLinks} />
</div>
