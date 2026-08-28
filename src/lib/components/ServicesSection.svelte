<script lang="ts">
  import type { Service } from '../data';
  import ServiceCard from './ServiceCard.svelte';

  interface Props {
    services: Service[];
  }

  let { services }: Props = $props();
</script>

<section id="services" class="mx-auto max-w-6xl px-4 py-16">
  <h2 class="text-center text-3xl font-bold text-primary-900">What we treat</h2>
  <p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
    From routine vaccinations to specialist exotic animal care — choose a service below to see
    how long an appointment typically takes.
  </p>

  <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each services as service}
      <ServiceCard {service} />
    {/each}
  </div>
</section>
