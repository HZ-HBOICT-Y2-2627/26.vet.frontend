<script lang="ts">
  import type { Pet } from '../../data';
  import PetCard from '../molecules/PetCard.svelte';

  interface Props {
    email: string;
    pets: Pet[];
  }

  let { email, pets }: Props = $props();
</script>

<section class="bg-slate-50 py-16">
  <div class="mx-auto max-w-6xl px-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-primary-900">Client portal</h1>
        <p class="mt-2 text-slate-600">You are logged in as <span class="font-semibold">{email}</span>.</p>
      </div>

      <!-- A form, not a link: logging out changes something, so it's a POST. -->
      <form method="POST" action="/logout">
        <button type="submit" class="rounded-full border border-primary-600 px-6 py-3 font-semibold text-primary-700 hover:bg-primary-100">
          Log out
        </button>
      </form>
    </div>

    <h2 class="mt-10 text-2xl font-bold text-primary-900">My pets</h2>

    {#if pets.length === 0}
      <p class="mt-4 text-slate-600">
        We haven't linked any pets to your account yet. Please call us and we'll add them for you.
      </p>
    {:else}
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each pets as pet}
          <PetCard {pet} />
        {/each}
      </div>
    {/if}
  </div>
</section>
