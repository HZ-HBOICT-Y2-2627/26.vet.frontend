<script lang="ts">
  // ------------------------------------------------------------------
  // Kliniek Van Dijk — homepage
  //
  // Reference solution for Assignment 1 (docs/assignment-1.md).
  // This file is now the "page": it owns no markup of its own beyond the
  // wrapper div, and composes the page from organisms — which compose
  // molecules, which compose atoms. Content lives in src/lib/data.ts.
  // See docs/submissions/reference-solution-notes.md for the reasoning
  // behind a few of the boundaries drawn here.
  // ------------------------------------------------------------------
  import SiteHeader from '$lib/components/organisms/SiteHeader.svelte';
  import HeroSection from '$lib/components/organisms/HeroSection.svelte';
  import TrustStrip from '$lib/components/organisms/TrustStrip.svelte';
  import ServicesSection from '$lib/components/organisms/ServicesSection.svelte';
  import TeamSection from '$lib/components/organisms/TeamSection.svelte';
  import BookingSection from '$lib/components/organisms/BookingSection.svelte';
  import PortalTeaserSection from '$lib/components/organisms/PortalTeaserSection.svelte';
  import TestimonialsSection from '$lib/components/organisms/TestimonialsSection.svelte';
  import PracticalInfoSection from '$lib/components/organisms/PracticalInfoSection.svelte';
  import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';

  import {
    navLinks,
    services,
    vets,
    appointmentTypes,
    openingHours,
    testimonials,
    trustStats,
  } from '$lib/data';
</script>

<div class="min-h-screen bg-white text-slate-800">
  <SiteHeader links={navLinks} />
  <HeroSection />
  <TrustStrip stats={trustStats} />
  <ServicesSection {services} />
  <TeamSection {vets} />
  <BookingSection {appointmentTypes} />
  <PortalTeaserSection />
  <TestimonialsSection {testimonials} />
  <PracticalInfoSection {openingHours} />
  <SiteFooter links={navLinks} />
</div>
