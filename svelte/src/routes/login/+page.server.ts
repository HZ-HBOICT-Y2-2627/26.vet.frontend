import { fail, redirect } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { LoginResponse } from '$lib/data';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { email, error: 'Please fill in your email address and password.' });
    }

    const response = await fetch(`${VET_SERVICE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.status >= 500) {
      return fail(503, { email, error: 'Logging in is not possible right now. Please try again later.' });
    }
    if (!response.ok) {
      return fail(401, { email, error: 'Check your email address and password and try again.' });
    }

    const result: LoginResponse = await response.json();
    cookies.set('token', result.token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days, the same as the token itself
    });

    redirect(303, '/portal');
  },
};
