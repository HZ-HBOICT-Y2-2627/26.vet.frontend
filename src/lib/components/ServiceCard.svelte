<script lang="ts">
  import type { Service } from '../data';
  import Badge from './Badge.svelte';

  interface Props {
    service: Service;
  }

  let { service }: Props = $props();
</script>

<div class="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md">
  <div class="text-3xl">{service.icon}</div>
  <h3 class="mt-4 text-lg font-semibold text-slate-900">{service.title}</h3>
  <p class="mt-2 text-sm text-slate-600">{service.description}</p>
  <div class="mt-4">
    <Badge>~{service.duration}</Badge>
  </div>
</div>
