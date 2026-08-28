<script lang="ts">
  import type { OpeningHoursRow } from '../data';

  interface Props {
    rows: OpeningHoursRow[];
  }

  let { rows }: Props = $props();
</script>

<table class="mt-4 w-full text-sm">
  <tbody>
    {#each rows as row}
      <tr class="border-b border-slate-200">
        <td class="py-2 font-medium text-slate-700">{row.day}</td>
        <td class="py-2 text-right text-slate-600">{row.hours}</td>
      </tr>
    {/each}
  </tbody>
</table>
