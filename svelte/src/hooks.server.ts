import type { Handle } from '@sveltejs/kit';

// Runs on the server for every request, before any load function or action.
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.token = event.cookies.get('token');
  return resolve(event);
};
