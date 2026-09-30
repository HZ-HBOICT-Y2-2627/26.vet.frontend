<script lang="ts">
  import type { Pet } from '../../data';
  import Badge from '../atoms/Badge.svelte';

  interface Props {
    pet: Pet;
  }

  let { pet }: Props = $props();

  // The API sends the birth date as text; turn it into a date people can read.
  let birthDate = $derived(
    new Date(pet.birthDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  );
</script>

<div class="rounded-2xl bg-white p-6 shadow-sm">
  <Badge text={pet.species} />
  <h3 class="mt-3 text-xl font-semibold text-slate-900">{pet.name}</h3>
  <p class="text-slate-600">{pet.breed}</p>
  <p class="mt-3 text-sm text-slate-500">Born on {birthDate}</p>
</div>
