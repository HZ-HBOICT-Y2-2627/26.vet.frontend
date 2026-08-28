<script lang="ts">
  // Just the pill itself — spacing/positioning is the parent's responsibility
  // (e.g. ServiceCard wraps it with the margin it needs in that layout).
  interface Props {
    text: string;
  }

  let { text }: Props = $props();
</script>

<span class="inline-block rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-600">
  {text}
</span>
