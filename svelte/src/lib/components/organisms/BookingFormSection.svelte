<script lang="ts">
  import type { Vet, AppointmentType } from "../../data";
  import VetCardMini from "../molecules/VetCardMini.svelte";
  import AppointmentSummary from "../molecules/AppointmentSummary.svelte";
  import AppointmentTypeSelect from "../molecules/AppointmentTypeSelect.svelte";
  import { setContext } from "svelte";
  // import { bookingState } from '../../state/booking-state.svelte';

  interface BookingState {
    selectedVet: Vet | null;
    selectedAppointmentType: AppointmentType | null;
  }

  const bookingState: BookingState = $state({ selectedVet: null, selectedAppointmentType: null });
  setContext("bookingState", bookingState);

  interface Props {
    vets: Vet[];
  }

  let { vets }: Props = $props();
</script>

<section class="mx-auto max-w-6xl px-4 py-16">
  <h1 class="text-3xl font-bold text-primary-900">Book an appointment</h1>
  <div class="mt-10 grid gap-6 md:grid-cols-3">
    <div class="md:col-span-2">
      <h3>Choose a vet</h3>
      <div class="grid gap-6 sm:grid-cols-2">
        {#each vets as vet}
          <VetCardMini {vet} />
        {/each}
      </div>
      <h3>Choose appointment type</h3>
      <AppointmentTypeSelect />
      <h3>Choose a date</h3>
      <h3>Choose a timeslot</h3>
    </div>
    <div
      class="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:col-span-1"
    >
      <AppointmentSummary />
    </div>
  </div>
</section>
