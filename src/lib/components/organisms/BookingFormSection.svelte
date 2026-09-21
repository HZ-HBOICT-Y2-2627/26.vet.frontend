<script lang="ts">
  import type { Vet } from "../../data";
  import VetCardMini from "../molecules/VetCardMini.svelte";
  import AppointmentSummary from "../molecules/AppointmentSummary.svelte";
  import { setContext } from "svelte";
  // import { bookingState } from '../../state/booking-state.svelte';

  interface BookingState {
    selectedVet: Vet | null;
  }

  const bookingState: BookingState = $state({ selectedVet: null });
  setContext("bookingState", bookingState);

  interface Props {
    vets: Vet[];
  }

  let { vets }: Props = $props();
</script>

<section class="mx-auto max-w-6xl px-4 py-16">
  <h1 class="text-3xl font-bold text-primary-900">Book an appointment</h1>
  <p class="mt-3 text-slate-600">Choose which vet you'd like to see.</p>

  <div class="mt-10 grid gap-8 md:grid-cols-3">
    <div class="grid gap-6 sm:grid-cols-2 md:col-span-2">
      {#each vets as vet}
        <VetCardMini {vet} />
      {/each}
    </div>

    <div
      class="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:col-span-1"
    >
      <AppointmentSummary />
    </div>
  </div>
</section>
