import { error, redirect } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { Pet, User } from '$lib/data';
import type { PageServerLoad } from './$types';
// Dummy data. Remove this import (and the data in data.ts) in Part C.
import { portalEmail, pets } from '$lib/data';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
  // TODO (Part C, step 2): no token in locals? Redirect to /login.

  // TODO (Part C, step 3): fetch `${VET_SERVICE_API_URL}/my/pets` with the
  // header Authorization: `Bearer ${locals.token}`.
  // - Status 401 (token expired or invalid): delete the 'token' cookie and
  //   redirect to /login.
  // - Any other error: error(503, '...').
  // - Otherwise: read the pets from the response as Pet[].

  // TODO (Part C, step 4): fetch `${VET_SERVICE_API_URL}/auth/me` with the
  // same header, and use user.email from the response instead of portalEmail.

  return { email: portalEmail, pets };
};
