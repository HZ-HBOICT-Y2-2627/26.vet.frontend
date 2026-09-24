<script lang="ts">

  //just for dummy purpose 
  let bookingState: boolean = false;

</script>

<h2 class="text-lg font-semibold text-primary-900">Summary</h2>

{#if bookingState}
  <p class="mt-4 text-sm text-slate-700">Yup the vet is selected.</p>
{:else}
  <p class="mt-4 text-sm text-slate-500">No vet selected yet.</p>
{/if}
