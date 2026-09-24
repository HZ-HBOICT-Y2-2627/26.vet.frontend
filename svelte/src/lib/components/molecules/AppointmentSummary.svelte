<script lang="ts">
  import { getContext } from 'svelte';
  import type { Vet, AppointmentType } from "../../data";
  // import type { BookingState } from '../../state/booking-state.svelte';

  interface BookingState {
    selectedVet: Vet | null;
    selectedAppointmentType: AppointmentType | null;
  }

  let bookingState: BookingState = getContext('bookingState');

</script>

<h2 class="text-lg font-semibold text-primary-900">Summary</h2>

{#if bookingState.selectedVet}
  <p class="mt-4 text-sm text-slate-700">{bookingState.selectedVet.name}</p>
{:else}
  <p class="mt-4 text-sm text-slate-500">No vet selected yet.</p>
{/if}

{#if bookingState.selectedAppointmentType}
  <p class="mt-2 text-sm text-slate-700">
    {bookingState.selectedAppointmentType.label} ({bookingState.selectedAppointmentType.durationMinutes} min)
  </p>
{:else}
  <p class="mt-2 text-sm text-slate-500">No appointment type selected yet.</p>
{/if}
