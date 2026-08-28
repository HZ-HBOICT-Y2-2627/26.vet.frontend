<script lang="ts">
  // The dropdown and the derived duration text are one interaction — they
  // stay in the same component rather than being split across two.
  import { untrack } from 'svelte';
  import type { AppointmentType } from '../data';

  interface Props {
    types: AppointmentType[];
  }

  let { types }: Props = $props();

  // Only the initial value should seed the selection — `types` is static
  // for this page, so `untrack` makes that explicit instead of Svelte
  // warning that a later change to `types` won't reset the selection.
  let selectedTypeId = $state(untrack(() => types[0].id));

  const selectedType = $derived(types.find((type) => type.id === selectedTypeId) ?? types[0]);
</script>

<label for="appointment-type" class="text-sm font-semibold text-slate-700">
  What is the visit for?
</label>
<select
  id="appointment-type"
  class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  bind:value={selectedTypeId}
>
  {#each types as type}
    <option value={type.id}>{type.label}</option>
  {/each}
</select>

<p class="mt-3 text-sm text-slate-500">
  Estimated duration: <span class="font-semibold text-primary-700">{selectedType.durationMinutes} minutes</span>
</p>
