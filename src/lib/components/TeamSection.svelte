<script lang="ts">
  import type { Vet } from '../data';
  import VetCard from './VetCard.svelte';

  interface Props {
    vets: Vet[];
  }

  let { vets }: Props = $props();
</script>

<section id="team" class="bg-slate-50 py-16">
  <div class="mx-auto max-w-6xl px-4">
    <h2 class="text-center text-3xl font-bold text-primary-900">Meet the team</h2>
    <p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
      Four veterinarians, three veterinary assistants and a front desk that actually knows your
      pet's name.
    </p>

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {#each vets as vet}
        <VetCard {vet} />
      {/each}
    </div>
  </div>
</section>
