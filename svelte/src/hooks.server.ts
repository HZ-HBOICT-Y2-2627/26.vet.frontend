import type { Handle } from '@sveltejs/kit';

// Runs on the server for every request, before any load function or action.
export const handle: Handle = async ({ event, resolve }) => {
  // TODO (Part C, step 1): read the 'token' cookie (event.cookies) and put it
  // on event.locals.token, so every load function and action can use it.
  // The type of event.locals is declared in src/app.d.ts.

  return resolve(event);
};
