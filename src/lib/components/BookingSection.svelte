<script lang="ts">
  import type { AppointmentType } from '../data';
  import { emergencyPhone } from '../data';
  import AppointmentTypeSelect from './AppointmentTypeSelect.svelte';

  interface Props {
    appointmentTypes: AppointmentType[];
  }

  let { appointmentTypes }: Props = $props();
</script>

<section id="book" class="mx-auto max-w-6xl px-4 py-16">
  <div class="grid gap-10 md:grid-cols-2">
    <div>
      <h2 class="text-3xl font-bold text-primary-900">Book an appointment</h2>
      <p class="mt-3 text-slate-600">
        Tell us what the visit is about and we'll reserve the right amount of time — the same
        way our front desk does over the phone.
      </p>

      <ol class="mt-6 space-y-4">
        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">1</span>
          <span class="text-sm text-slate-700">Choose the reason for your visit.</span>
        </li>
        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">2</span>
          <span class="text-sm text-slate-700">Pick a date and time that works for you.</span>
        </li>
        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">3</span>
          <span class="text-sm text-slate-700">Confirm — we'll send you a reminder before your visit.</span>
        </li>
      </ol>
    </div>

    <div class="rounded-2xl border border-slate-200 p-6 shadow-sm">
      <AppointmentTypeSelect types={appointmentTypes} />

      <label for="appointment-date" class="mt-4 block text-sm font-semibold text-slate-700">
        Preferred date
      </label>
      <input
        id="appointment-date"
        type="date"
        class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      <button
        type="button"
        class="mt-6 w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
      >
        Check availability
      </button>

      <p class="mt-3 text-center text-xs text-slate-500">
        Prefer to talk to someone? Call <a href={emergencyPhone.href} class="underline">{emergencyPhone.display}</a>.
      </p>
    </div>
  </div>
</section>
