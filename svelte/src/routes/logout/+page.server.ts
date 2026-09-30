import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Only an action, no page: the log out button in PortalSection posts here.
export const actions: Actions = {
  default: async ({ cookies }) => {
    // TODO (Part D): delete the 'token' cookie (with path: '/').

    redirect(303, '/');
  },
};

// Someone who opens /logout in the address bar just goes back home.
export const load: PageServerLoad = async () => {
  redirect(303, '/');
};
