<script lang="ts">
  interface Props {
    value: string;
    label: string;
  }

  let { value, label }: Props = $props();
</script>

<div>
  <p class="text-3xl font-bold text-primary-700">{value}</p>
  <p class="text-sm text-slate-500">{label}</p>
</div>
