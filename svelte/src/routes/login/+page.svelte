<script lang="ts">
  import SiteHeader from '$lib/components/organisms/SiteHeader.svelte';
  import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
  import { navLinks } from '$lib/data';
  import type { PageProps } from './$types';

  // form: what the action returned with fail(), or null on the first visit.
  let { form }: PageProps = $props();
</script>

<div class="min-h-screen bg-white text-slate-800">
  <SiteHeader links={navLinks} />

  <section class="bg-slate-50 py-16">
    <div class="mx-auto max-w-md px-4">
      <h1 class="text-3xl font-bold text-primary-900">Log in to the client portal</h1>
      <p class="mt-2 text-slate-600">See your pets' records, whenever you need them.</p>

      <form method="POST" class="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        {#if form?.error}
          <p role="alert" class="rounded-lg bg-red-50 p-3 text-red-700">{form.error}</p>
        {/if}

        <div>
          <label for="email" class="block font-semibold text-slate-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            value={form?.email ?? ''}
            class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label for="password" class="block font-semibold text-slate-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <button type="submit" class="w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700">
          Log in
        </button>
      </form>
    </div>
  </section>

  <SiteFooter links={navLinks} />
</div>
