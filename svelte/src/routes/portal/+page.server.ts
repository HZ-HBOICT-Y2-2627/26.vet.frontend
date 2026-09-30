import { error, redirect } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { Pet, User } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
  if (!locals.token) {
    redirect(303, '/login');
  }

  const headers = { Authorization: `Bearer ${locals.token}` };

  const petsResponse = await fetch(`${VET_SERVICE_API_URL}/my/pets`, { headers });

  // The token is no longer valid (e.g. expired): log out and log in again.
  if (petsResponse.status === 401) {
    cookies.delete('token', { path: '/' });
    redirect(303, '/login');
  }
  if (!petsResponse.ok) {
    error(503, 'Could not load your pets. Please try again later.');
  }
  const pets: Pet[] = await petsResponse.json();

  const meResponse = await fetch(`${VET_SERVICE_API_URL}/auth/me`, { headers });
  if (!meResponse.ok) {
    error(503, 'Could not load your account. Please try again later.');
  }
  const me: { user: User } = await meResponse.json();

  return { email: me.user.email, pets };
};
