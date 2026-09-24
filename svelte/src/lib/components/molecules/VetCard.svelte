<script lang="ts">
  import type { Vet } from '../../data';

  interface Props {
    vet: Vet;
  }

  let { vet }: Props = $props();
</script>

<div class="rounded-2xl bg-white p-6 text-center shadow-sm">
  <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
    {vet.initials}
    😷
  </div>
  <h3 class="mt-4 font-semibold text-slate-900">{vet.name}</h3>
  <p class="text-sm font-medium text-primary-700">{vet.role}</p>
</div>
