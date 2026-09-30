import { fail, redirect } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { LoginResponse } from '$lib/data';
import type { Actions } from './$types';

export const actions: Actions = {
  // Runs on the server when the login form is submitted (method="POST").
  default: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    // TODO (Part B, step 1): when email or password is empty, return
    // fail(400, { email, error: '...' }) with a message in plain language.

    // TODO (Part B, step 2): send email and password to the gateway:
    // POST `${VET_SERVICE_API_URL}/auth/login` with a JSON body.

    // TODO (Part B, step 3): when the response is not ok, return fail(...)
    // with a message. A status of 500 or higher means the service is down;
    // anything else means the email or password is wrong.

    // TODO (Part B, step 4): read the LoginResponse from the response, store
    // the token in an httpOnly cookie named 'token', and redirect to /portal.

    // Remove this line when you're done.
    return fail(501, { email, error: 'Logging in is not built yet. That is Part B!' });
  },
};
