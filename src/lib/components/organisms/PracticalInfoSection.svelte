<script lang="ts">
  import type { OpeningHoursRow } from '../../data';
  import OpeningHoursTable from '../molecules/OpeningHoursTable.svelte';

  interface Props {
    openingHours: OpeningHoursRow[];
  }

  let { openingHours }: Props = $props();
</script>

<section class="bg-slate-50 py-16">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
    <div>
      <h2 class="text-2xl font-bold text-primary-900">Opening hours</h2>
      <OpeningHoursTable rows={openingHours} />
    </div>
    <div>
      <h2 class="text-2xl font-bold text-primary-900">Find us</h2>
      <p class="mt-4 text-sm text-slate-600">Dorpsstraat 42, 4331 AB Middelburg</p>
      <div class="mt-4 flex h-40 items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-500">
        Map placeholder
      </div>
    </div>
  </div>
</section>
