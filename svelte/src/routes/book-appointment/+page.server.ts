import { error } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { Vet } from '$lib/data';
import type { PageServerLoad } from './$types';

// The page loads the vets on the server, before anything is rendered.
// Compare with the appointment types, which the component loads itself in the
// browser — see lib/components/molecules/AppointmentTypeSelect.svelte.
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch(`${VET_SERVICE_API_URL}/vets`);

  if (!response.ok) {
    error(503, 'Could not load the vets. Is the vets service running?');
  }

  // A type annotation, not a check: TypeScript trusts the API to send Vet objects.
  const vets: Vet[] = await response.json();
  return { vets };
};
