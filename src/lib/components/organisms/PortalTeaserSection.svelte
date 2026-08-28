<script lang="ts">
  import Button from '../atoms/Button.svelte';
</script>

<section id="portal" class="bg-primary-800 py-16 text-primary-50">
  <div class="mx-auto max-w-6xl px-4 text-center">
    <h2 class="text-3xl font-bold">Your pet's records, whenever you need them</h2>
    <p class="mx-auto mt-3 max-w-2xl text-primary-100">
      Vaccination history, treatments and medication — available online, in plain language, no
      technical jargon.
    </p>
    <div class="mt-6">
      <Button href="#portal-login" variant="inverse">Log in to the client portal</Button>
    </div>
  </div>
</section>
