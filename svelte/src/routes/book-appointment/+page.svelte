<script lang="ts">
  import SiteHeader from '$lib/components/organisms/SiteHeader.svelte';
  import BookingFormSection from '$lib/components/organisms/BookingFormSection.svelte';
  import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
  import { navLinks } from '$lib/data';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-white text-slate-800">
  <SiteHeader links={navLinks} />
  <BookingFormSection vets={data.vets} />
  <SiteFooter links={navLinks} />
</div>
