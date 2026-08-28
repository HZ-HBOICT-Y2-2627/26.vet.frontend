<script lang="ts">
  import type { Testimonial } from '../data';
  import TestimonialCard from './TestimonialCard.svelte';

  interface Props {
    testimonials: Testimonial[];
  }

  let { testimonials }: Props = $props();
</script>

<section class="mx-auto max-w-6xl px-4 py-16">
  <h2 class="text-center text-3xl font-bold text-primary-900">What our clients say</h2>
  <div class="mt-10 grid gap-6 md:grid-cols-2">
    {#each testimonials as testimonial}
      <TestimonialCard {testimonial} />
    {/each}
  </div>
</section>
