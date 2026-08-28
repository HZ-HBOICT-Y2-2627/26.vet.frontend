<script lang="ts">
  import type { TrustStat } from '../../data';
  import TrustStatItem from '../atoms/TrustStatItem.svelte';

  interface Props {
    stats: TrustStat[];
  }

  let { stats }: Props = $props();
</script>

<section class="border-y border-slate-200 bg-white">
  <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4">
    {#each stats as stat}
      <TrustStatItem value={stat.value} label={stat.label} />
    {/each}
  </div>
</section>
