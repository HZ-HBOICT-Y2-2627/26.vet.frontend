<script lang="ts">
  import Button from './Button.svelte';
</script>

<section id="home" class="bg-primary-50">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
    <div>
      <h1 class="text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
        Caring for your best friend, on your schedule.
      </h1>
      <p class="mt-4 text-lg text-slate-600">
        Book appointments online, see your pet's records whenever you need them, and reach
        us by phone whenever you'd rather talk to a person. Kliniek Van Dijk has been caring
        for dogs, cats, rabbits and more for over 18 years.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <Button href="#book">Book an appointment</Button>
        <Button href="#portal" variant="outline">View my pet's records</Button>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex h-64 w-64 items-center justify-center rounded-full bg-primary-100 text-8xl md:h-80 md:w-80">
        🐶🐱
      </div>
    </div>
  </div>
</section>
