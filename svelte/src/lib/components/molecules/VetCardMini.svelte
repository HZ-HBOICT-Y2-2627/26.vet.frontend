<script lang="ts">
  //just for dummy purpose
  let bookingState: boolean = false;
</script>

<div class="rounded-2xl bg-white p-6 text-center shadow-sm">
  <button
    type="button"
    class="text-left"
    onclick={() => (bookingState = true)}
  >
    <div
      class="mx-auto flex items-center justify-center rounded-ful text-6xl font-bold text-white"
    >
      😷
    </div>
  </button>

  <h3 class="mt-4 font-semibold text-slate-900">{vet.name}</h3>
</div>
