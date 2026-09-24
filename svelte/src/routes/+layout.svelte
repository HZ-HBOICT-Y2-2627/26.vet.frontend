<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Kliniek Van Dijk</title>
</svelte:head>

{@render children()}
