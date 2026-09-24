<script lang="ts">
  // This component loads its own data: the appointment types are fetched in
  // the browser, after the component is on the screen (onMount).
  // Compare with the vets, which are loaded by the page on the server before
  // rendering — see routes/book-appointment/+page.server.ts.
  import { getContext, onMount } from 'svelte';
  import { PUBLIC_VET_SERVICE_API_URL } from '$env/static/public';
  import type { AppointmentType } from '../../data';

  interface BookingState {
    selectedAppointmentType: AppointmentType | null;
  }

  // The chosen type lives in the shared booking state, so other components
  // (like AppointmentSummary) can show it too.
  let bookingState: BookingState = getContext('bookingState');

  // Loading data in a component means handling its states yourself.
  let types: AppointmentType[] = $state([]);
  let loading = $state(true);
  let errorMessage = $state('');

  onMount(async () => {
    try {
      const response = await fetch(`${PUBLIC_VET_SERVICE_API_URL}/appointment-types`);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      types = await response.json();
    } catch {
      errorMessage = 'Could not load the appointment types.';
    } finally {
      loading = false;
    }
  });
</script>

<label for="appointment-type" class="text-sm font-semibold text-slate-700">
  What is the visit for?
</label>

{#if loading}
  <p class="mt-2 text-sm text-slate-500">Loading appointment types…</p>
{:else if errorMessage}
  <p class="mt-2 text-sm text-red-600">{errorMessage}</p>
{:else}
  <select
    id="appointment-type"
    class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    bind:value={bookingState.selectedAppointmentType}
  >
    <option value={null} disabled>Choose a reason</option>
    {#each types as type}
      <option value={type}>{type.label}</option>
    {/each}
  </select>

  {#if bookingState.selectedAppointmentType}
    <p class="mt-3 text-sm text-slate-500">
      Estimated duration: <span class="font-semibold text-primary-700">{bookingState.selectedAppointmentType.durationMinutes} minutes</span>
    </p>
  {/if}
{/if}
