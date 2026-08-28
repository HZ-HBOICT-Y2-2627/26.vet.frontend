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
  import SiteHeader from './lib/components/SiteHeader.svelte';
  import HeroSection from './lib/components/HeroSection.svelte';
  import TrustStrip from './lib/components/TrustStrip.svelte';
  import ServicesSection from './lib/components/ServicesSection.svelte';
  import TeamSection from './lib/components/TeamSection.svelte';
  import BookingSection from './lib/components/BookingSection.svelte';
  import PortalTeaserSection from './lib/components/PortalTeaserSection.svelte';
  import TestimonialsSection from './lib/components/TestimonialsSection.svelte';
  import PracticalInfoSection from './lib/components/PracticalInfoSection.svelte';
  import SiteFooter from './lib/components/SiteFooter.svelte';

  import {
    navLinks,
    services,
    vets,
    appointmentTypes,
    openingHours,
    testimonials,
    trustStats,
  } from './lib/data';
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
