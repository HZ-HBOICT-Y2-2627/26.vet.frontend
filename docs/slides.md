---
marp: true
paginate: true
title: Lesson 5 — Logging in to the client portal
---

# Lesson 5
## Logging in to the client portal

Kliniek Van Dijk · SvelteKit + three Express services

Assignment: [`docs/assignment-5.md`](./assignment-5.md)

---

## Today (90 minutes)

| Time | What |
| --- | --- |
| 0–10 | **Concepts:** services, gateway, tokens |
| 10–25 | **Part A:** explore the login with `curl` |
| 25–33 | **Concepts:** form actions and cookies |
| 33–53 | **Part B:** the login page |
| 53–60 | **Concepts:** hooks, `locals`, protected pages |
| 60–80 | **Part C:** connect the portal |
| 80–90 | **Part D:** log out · wrap-up |

The pages are already there. You write the **server code**, following the `TODO`s.

---

## Where we are

- `/portal` shows Noor's pets, but they're **dummy data** from `data.ts`
- **Anyone** can open `/portal`
- Noor's story: she didn't know which medication Roos had been given

Personal data needs a **login**, and every user should see **only their own** pets.

---

# Concepts
## Services, gateway, tokens

---

## Two questions

**Authentication:** *who are you?*
→ email + password → auth-service says "this is Noor"

**Authorization:** *what may you see?*
→ Noor may see Roos, not Sam's dog Max

Today we build both, and we're careful about **where** each question is answered.

---

## Three services, one entry point

```text
Svelte app ──▶ API gateway :3000 ──▶ auth-service :4001   accounts, login, tokens
                                 └─▶ vets_service :4000   vets, treatments, owners, pets
```

- The frontend **only** talks to the gateway
- The gateway **checks logins** and forwards the request
- `GET /vets` etc. are public; `GET /my/pets` needs a login

---

## Tokens (JWT)

After logging in you get a **token**: a piece of text that says *"this is noor@example.com"*,
signed with a secret key.

```text
eyJhbGciOiJIUzI1NiIs...   .   eyJzdWIiOjEsImVtYWlsIjoi...   .   SflKxwRJSMeKKF2QT4f...
       header                     payload (readable!)                  signature
```

- **Signed, not secret:** anyone can read the payload
- The signature proves nobody **changed** it
- So: an email and a role, never a password

---

## A request for `/my/pets`

```text
1. Svelte    ──  GET /my/pets
                 Authorization: Bearer eyJhbGci...      ──▶ gateway

2. gateway   ──  is the signature valid? not expired?
                 no  → 401
                 yes → add X-User-Email: noor@example.com ──▶ vets_service

3. vets_service ── pets of the owner with that email     ──▶ [ Roos ]
```

The login **email** links an account in auth-service to an owner in vets_service.

---

## Setup (do this now if you haven't yet)

```bash
cd services/vets_service   && npm install && npm run prisma:migrate && npm run prisma:seed && npm run dev
cd services/auth-service   && cp .env.example .env && npm install && npm run prisma:migrate && npm run prisma:seed && npm run dev
cd services/api-gateway-service && cp .env.example .env && npm install && npm run dev
cd svelte && npm install && npm run dev
```

Four terminals. Accounts (password `supersecret1`):
`noor@example.com` · `sam@example.com` · `lisa@example.com`

Check: <http://localhost:3000/vets> shows JSON, <http://localhost:3000/my/pets> gives `401`.

---

# Part A
## Explore the login (15 min, no Svelte code)

Work in pairs. Write your answers in `docs/submissions/<your-names>-assignment-5.md`.

---

## A1 — Log in as Noor

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"noor@example.com","password":"supersecret1"}'
```

What do you get back? Copy the `token`, you need it in the next steps:

```bash
TOKEN=eyJhbGci...
```

---

## A2 — Three requests for `/my/pets`

```bash
curl -i http://localhost:3000/my/pets
curl -i http://localhost:3000/my/pets -H "Authorization: Bearer $TOKEN"
curl -i http://localhost:3000/my/pets -H "Authorization: Bearer ${TOKEN}x"
```

Write down the **status code** and **response** of each. Who sent the `401`: the gateway or
vets_service?

---

## A3 — What's inside the token?

Paste Noor's token into <https://jwt.io>. (It's a dev token, so that's fine.)

- What's in the payload?
- What **isn't** in there, and why not?
- When does it expire? (`exp` is in seconds since 1970)

---

## A4 — Can you pretend to be Noor?

Register your own account and ask for "your" pets, while claiming to be Noor:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"supersecret1"}'

curl http://localhost:3000/my/pets \
  -H "Authorization: Bearer <your token>" \
  -H "X-User-Email: noor@example.com"
```

Do you get Roos? Find the line in
`services/api-gateway-service/src/middleware/authenticate.ts` that explains it.

---

## A5 — Follow the request

Trace `GET /my/pets` from the gateway to the database:

1. `api-gateway-service/src/server.ts` → which middleware runs for `/my`?
2. `api-gateway-service/src/middleware/authenticate.ts`
3. `vets_service/src/routes/my.ts`
4. `vets_service/src/services/OwnerService.ts`

Where is the email used? Why is there no email in the URL?

---

# Concepts
## Form actions and cookies

---

## Where does the token live?

| | `localStorage` | httpOnly cookie |
| --- | --- | --- |
| Who can read it | all JavaScript, also a malicious script (XSS) | only the server |
| Sent automatically | no, add a header yourself | yes, with every request to your site |
| Available in `+page.server.ts` | no | yes |
| Who calls the gateway | the browser | the SvelteKit server |

We use an **httpOnly cookie**.

---

## The browser never sees the token

```text
Browser ──cookie──▶ SvelteKit server ──Authorization: Bearer <token>──▶ API gateway
```

- The browser only talks to **our own** SvelteKit server
- The SvelteKit server reads the cookie and calls the gateway
- JavaScript in the page can't read the cookie (`document.cookie` won't show it)

---

## Form actions

A `<form method="POST">` is handled by `actions` in `+page.server.ts`, **on the server**:

```svelte
<!-- +page.svelte (already there) -->
<form method="POST">
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Log in</button>
</form>
```

```ts
// +page.server.ts (you write this)
export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    // ...
  },
};
```

Works even without JavaScript in the browser.

---

## `fail()` and `redirect()`

```ts
return fail(400, { email, error: 'Please fill in your email address and password.' });
```
→ the page shows the form again, and gets `{ email, error }` in its `form` prop

```ts
redirect(303, '/portal');
```
→ the browser goes to another page

> `redirect()` and `error()` **throw**. Never put them inside a `try` block: your `catch`
> swallows the redirect.

---

## Cookies

Every server function gets `cookies`:

```ts
cookies.set('token', token, {
  path: '/',          // for the whole site (required)
  httpOnly: true,     // JavaScript can't read it
  sameSite: 'lax',    // not sent along when another site posts to ours
  maxAge: 60 * 60 * 24 * 7, // 7 days, like the token
});

cookies.get('token');                  // string | undefined
cookies.delete('token', { path: '/' });
```

---

# Part B
## The login page (20 min)

---

## What's already there

| File | Status |
| --- | --- |
| `routes/login/+page.svelte` | ✅ done: the form, the error message, keeps the email |
| `lib/data.ts` | ✅ `LoginResponse` and `User` interfaces |
| Homepage button | ✅ links to `/login` |
| `routes/login/+page.server.ts` | ✏️ **you:** the `TODO`s |

Open <http://localhost:5173/login> and submit: *"Logging in is not built yet."*

---

## B1 — Empty fields

```ts
if (!email || !password) {
  return fail(400, { email, error: 'Please fill in your email address and password.' });
}
```

Plain language: Noor doesn't know what "400" or "validation error" means.

---

## B2 — Send the login to the gateway

```ts
const response = await fetch(`${VET_SERVICE_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

- `VET_SERVICE_API_URL` is `http://localhost:3000`, the **gateway**
- Use the `fetch` you get from the action, not the global one

---

## B3 — When the login fails

```ts
if (response.status >= 500) {
  return fail(503, { email, error: 'Logging in is not possible right now. Please try again later.' });
}
if (!response.ok) {
  return fail(401, { email, error: 'Check your email address and password and try again.' });
}
```

Why not say *"This email doesn't exist"*? What would an attacker learn from that?

---

## B4 — Store the token, go to the portal

```ts
const result: LoginResponse = await response.json();

cookies.set('token', result.token, {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
});

redirect(303, '/portal');
```

Remove the `return fail(501, …)` line at the bottom.

---

## Test Part B

1. Log in with a wrong password → message, email still filled in
2. Log in as `noor@example.com` / `supersecret1` → you land on `/portal`
3. DevTools → **Application → Cookies**: is `token` there? Is **HttpOnly** checked?
4. Console: `document.cookie` → do you see the token? Why not?
5. Stop auth-service and log in → which message do you get?

The portal still shows dummy data. That's Part C.

---

# Concepts
## Hooks, `locals`, protected pages

---

## `hooks.server.ts` and `locals`

`src/hooks.server.ts` runs on the server for **every** request, before any `load` or action:

```text
request ──▶ hooks.server.ts ──▶ +page.server.ts (load / actions) ──▶ +page.svelte
             event.locals.token = …      locals.token
```

The type of `locals` lives in `src/app.d.ts` (✅ already there):

```ts
interface Locals {
  token?: string;
}
```

Read the cookie **once**, use `locals.token` everywhere.

---

## Protect on the server

- Hiding a menu link doesn't protect a page: anyone can type `/portal`
- The check belongs in the **`load` function** that loads the data
- The frontend sends **the token**, never an email or id

```text
✗  GET /pets?email=noor@example.com    ← change the email, read someone else's pets
✓  GET /my/pets + token                ← the backend decides whose pets
```

---

# Part C
## Connect the portal (20 min)

---

## What's already there

| File | Status |
| --- | --- |
| `app.d.ts` | ✅ `Locals` type |
| `routes/portal/+page.svelte` | ✅ uses `data.email` and `data.pets` |
| `PortalSection`, `PetCard` | ✅ no changes needed |
| `hooks.server.ts` | ✏️ **you:** 1 line |
| `routes/portal/+page.server.ts` | ✏️ **you:** the `TODO`s (it returns dummy data now) |

---

## C1 — Read the cookie in the hook

```ts
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.token = event.cookies.get('token');
  return resolve(event);
};
```

That's it. Now every `load` and action has `locals.token`.

---

## C2 — Not logged in? Go to the login page

```ts
export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
  if (!locals.token) {
    redirect(303, '/login');
  }
  // ...
};
```

Test: open `/portal` in a private window → you land on `/login`.

---

## C3 — Load the pets with the token

```ts
const headers = { Authorization: `Bearer ${locals.token}` };

const petsResponse = await fetch(`${VET_SERVICE_API_URL}/my/pets`, { headers });

if (petsResponse.status === 401) {       // token expired or invalid
  cookies.delete('token', { path: '/' });
  redirect(303, '/login');
}
if (!petsResponse.ok) {
  error(503, 'Could not load your pets. Please try again later.');
}
const pets: Pet[] = await petsResponse.json();
```

---

## C4 — Who is logged in?

```ts
const meResponse = await fetch(`${VET_SERVICE_API_URL}/auth/me`, { headers });
if (!meResponse.ok) {
  error(503, 'Could not load your account. Please try again later.');
}
const me: { user: User } = await meResponse.json();

return { email: me.user.email, pets };
```

Clean up: remove the dummy import in `+page.server.ts`, and `portalEmail` and `pets` in `data.ts`.

*Tip: `Promise.all` fetches both at the same time.*

---

## Test Part C

1. Log in as **Noor** → Roos
2. Log in as **Sam** → Max and Pip, **not** Roos
3. Log in as **Lisa** → Olaf and Saar
4. DevTools → Application → Cookies: change the token value, reload `/portal` → `/login`
5. `npm run check` → 0 errors

---

# Part D
## Log out (5 min)

---

## D — Delete the cookie

The "Log out" button in `PortalSection` is a **form** that posts to `/logout`
(✅ already there). Fill in the `TODO` in `routes/logout/+page.server.ts`:

```ts
export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete('token', { path: '/' });
    redirect(303, '/');
  },
};
```

Why a form and not a link? A link preview or a browser that pre-loads links would log you out.

Test: log out → open `/portal` → `/login`.

---

## Stuck?

| You see | Check |
| --- | --- |
| `/my/pets` gives `502` | is vets_service running? |
| Login always fails | did you run `npm run prisma:seed` in auth-service? |
| `fetch failed` / `ECONNREFUSED` | is the gateway running? `svelte/.env` says `3000`, not `4000`? |
| Redirect doesn't happen | is `redirect()` inside a `try` block? |
| Cookie is gone after a reload | did you set `path: '/'`? |
| Portal shows no pets | logged in with a registered account that isn't an owner? |

---

## Wrap-up

What we built:

```text
login form ──action──▶ gateway /auth/login ──▶ token ──▶ httpOnly cookie
portal     ──load────▶ hook reads cookie ──▶ gateway /my/pets + token ──▶ only your pets
```

**Homework:** the reflection in `docs/submissions/<your-names>-assignment-5.md`:

1. Why an httpOnly cookie and not `localStorage`?
2. What goes wrong with `GET /pets?email=…`?
3. vets_service trusts `X-User-Email` blindly. When is that safe, and when not?

Finished early? See the stretch goals in the assignment.
