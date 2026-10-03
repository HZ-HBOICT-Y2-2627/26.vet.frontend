# Assignment 5 — Logging in to the client portal

**Case:** Kliniek Van Dijk (see [`design.md`](../design.md))
**Stack:** SvelteKit + Svelte 5 + TypeScript, ExpressJS services in [`services/`](../../services)
**Format:** one lesson of 90 minutes (Parts A–D); the reflection is homework

## Context

Noor de Boer once stood at a specialist's desk without knowing which medication her cat Roos
had been given. The client portal is the answer to that story: a place where clients see their
own pets' records, in plain language (see [`design.md`](../design.md)).

A portal page already exists: [`/portal`](../../svelte/src/routes/portal). But it shows **dummy
data** from [`data.ts`](../../svelte/src/lib/data.ts), and anyone can open it. Personal data like
this should only be visible to the owner, so the portal needs a **login**.

The backend is ready for it. Since the last lesson there are three services, and the frontend
only talks to one of them, the **API gateway**:

```text
Svelte app ──▶ API gateway :3000 ──▶ auth-service :4001   (accounts, login, tokens)
                                 └─▶ vets_service :4000   (vets, treatments, owners, pets)
```

| Endpoint (on the gateway) | Needs a login? | Returns |
| --- | --- | --- |
| `POST /auth/register` | no | `{ token, user }` for a new account |
| `POST /auth/login` | no | `{ token, user }` when email and password are correct, `401` otherwise |
| `GET /auth/me` | yes | `{ user }` — the logged-in account |
| `GET /vets`, `/treatments`, `/appointment-types` | no | public data, like before |
| `GET /my/pets` | yes | the pets of the logged-in user |

In this assignment you'll build the login, keep the user logged in across pages, and replace the
dummy data in the portal with the real pets of whoever is logged in.

## What's already there

To fit everything into one lesson, all pages and components are ready. You write the **server
code**, following the `TODO` comments:

| File | Status |
| --- | --- |
| [`routes/login/+page.svelte`](../../svelte/src/routes/login/+page.svelte) | ready: the login form, shows the error message, keeps the email |
| [`routes/login/+page.server.ts`](../../svelte/src/routes/login/+page.server.ts) | **Part B:** the login action |
| [`app.d.ts`](../../svelte/src/app.d.ts) | ready: the type of `event.locals` |
| [`hooks.server.ts`](../../svelte/src/hooks.server.ts) | ready: reads the token cookie into `event.locals.token` |
| [`routes/portal/+page.svelte`](../../svelte/src/routes/portal/+page.svelte) | ready: shows `data.email` and `data.pets` |
| [`routes/portal/+page.server.ts`](../../svelte/src/routes/portal/+page.server.ts) | **Part C:** load the pets (returns dummy data for now) |
| [`routes/logout/+page.server.ts`](../../svelte/src/routes/logout/+page.server.ts) | **Part D:** delete the cookie |
| `PortalSection` (with a log out button), `PetCard` | ready: no changes needed |
| [`lib/data.ts`](../../svelte/src/lib/data.ts) | ready: `Pet`, `User` and `LoginResponse` interfaces |

## Lesson plan

| Time | What |
| --- | --- |
| 0–10 | Concepts: services, gateway, tokens |
| 10–25 | Part A: explore the login |
| 25–33 | Concepts: form actions and cookies |
| 33–53 | Part B: the login page |
| 53–57 | Concepts: hooks, `locals`, protected pages |
| 57–80 | Part C: connect the portal |
| 80–90 | Part D: log out · wrap-up |

## Learning objectives

By the end of this assignment you can:

1. Explain how token-based authentication works in this system: who creates the token, who
   checks it, and how a service knows *who* is asking.
2. Build a login form with a SvelteKit **form action** (`+page.server.ts`), including validation
   errors with `fail()` and a `redirect()` after success.
3. Store a token in an **httpOnly cookie**, and explain how `hooks.server.ts` makes it available
   to every server function through `event.locals`.
4. Load personal data in a `load` function by sending the token to the API, and handle a user
   who isn't logged in (anymore).
5. Argue where a token should be stored, and why the frontend must never decide *whose* data it
   gets.

## Before you start

**Do this before the lesson**, so you can start right away. You need four terminals: three for
the services and one for the Svelte app.

```bash
# Terminal 1 — the vets service
cd services/vets_service
npm install
npm run prisma:migrate   # adds the owners and pets tables
npm run prisma:seed
npm run dev              # runs on http://localhost:4000

# Terminal 2 — the auth service
cd services/auth-service
cp .env.example .env     # first time only
npm install
npm run prisma:migrate
npm run prisma:seed      # adds login accounts for the dummy owners
npm run dev              # runs on http://localhost:4001

# Terminal 3 — the API gateway
cd services/api-gateway-service
cp .env.example .env     # first time only
npm install
npm run dev              # runs on http://localhost:3000

# Terminal 4 — the Svelte app
cd svelte
npm install
npm run dev
```

Check that the gateway works by opening <http://localhost:3000/vets> in your browser. You should
see JSON. Then open <http://localhost:3000/my/pets>: you should get a `401`.

The seed created three accounts, all with password `supersecret1`:

| Email | Owner | Pets |
| --- | --- | --- |
| `noor@example.com` | Noor de Boer | Roos |
| `sam@example.com` | Sam Jansen | Max, Pip |
| `lisa@example.com` | Lisa Bakker | Olaf, Saar |

Your `svelte/.env` already points at the gateway (`VET_SERVICE_API_URL=http://localhost:3000`).
If you copied `.env` in an earlier lesson, check that it says `3000`, not `4000`.

---

## Background — how the login works

### 1. Tokens: the gateway checks, the services trust

1. The user logs in with `POST /auth/login`. The gateway passes this on to **auth-service**,
   which checks the password and returns a **token** (a JWT): a piece of text that says "this is
   `noor@example.com`", signed with a secret key.
2. From then on, every request that needs a login sends that token in a header:

   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

3. The **gateway** checks the signature. It knows the same secret as auth-service, so it can do
   this itself without asking auth-service every time. A wrong or expired token gets a `401`.
4. If the token is valid, the gateway adds the user's email as a header (`X-User-Email`) and
   passes the request on. **vets_service** trusts that header and returns the pets of the owner
   with that email.

The login email is what links an account in auth-service to an owner in vets_service. See
[`authenticate.ts`](../../services/api-gateway-service/src/middleware/authenticate.ts) and
[`my.ts`](../../services/vets_service/src/routes/my.ts).

> **A token is signed, not secret.** Anyone can read what's inside a JWT; the signature only
> proves nobody changed it. That's why it holds an email and a role, never a password.

### 2. Where does the token live?

After logging in, the app has to remember the token and send it with every request. There are
two common places to keep it:

| | `localStorage` | httpOnly cookie |
| --- | --- | --- |
| **Who can read it** | all JavaScript on the page, including a malicious script (XSS) | only the server; JavaScript can't read it |
| **Sent automatically** | no, you add the header to every `fetch` yourself | yes, the browser sends it to your SvelteKit server with every request |
| **Available in `load` on the server** (`+page.server.ts`) | no, the server can't see `localStorage` | yes, through `cookies` |
| **Who calls the gateway** | the browser | the SvelteKit server |

In this assignment we use an **httpOnly cookie**. The browser only ever talks to our own
SvelteKit server; the SvelteKit server reads the cookie and calls the gateway with the token:

```text
Browser ──cookie──▶ SvelteKit server ──Authorization: Bearer <token>──▶ API gateway
```

### 3. SvelteKit tools you'll need

**Form actions.** A `<form method="POST">` on a page is handled by `actions` in the page's
`+page.server.ts`. It runs on the server and works even without JavaScript:

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const email = form.get('email');
    // ...call the API...
    if (somethingIsWrong) {
      return fail(400, { email, error: 'A message for the user' });
    }
    redirect(303, '/somewhere');
  },
};
```

The page reads what `fail()` returned through the `form` prop (`let { form }: PageProps = $props()`).

> `redirect()` and `error()` work by *throwing*. Don't put them inside a `try` block, or your
> `catch` will swallow the redirect.

**Cookies.** Every server function gets `cookies`:

```ts
cookies.set('token', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
cookies.get('token');    // string | undefined
cookies.delete('token', { path: '/' });
```

**Hooks and `locals`.** `src/hooks.server.ts` runs on **every** request, before any `load` or
action. Whatever you put on `event.locals` there is available in every server function after it.
Its type is declared in `src/app.d.ts` (already there):

```ts
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      token?: string;
    }
  }
}
export {};
```

---

## Design considerations — who decides whose data you get?

The tempting shortcut is to let the frontend ask for the data it wants:
`GET /pets?email=noor@example.com`. It works, it's easy, and it's wrong: anyone who is logged in
could change the email in the URL and read someone else's pets.

The rule: **the frontend proves who it is (the token); the backend decides what that person may
see.** That's why `/my/pets` has no email or id in the URL, and why the gateway overwrites any
`X-User-Email` header the client sends.

The same idea applies to the frontend itself. Hiding a link in the menu doesn't protect a page;
someone can type `/portal` in the address bar. The check belongs in the server code that loads
the data.

| Question | Where it's answered |
| --- | --- |
| Is this password correct? | auth-service |
| Is this token valid and not expired? | the gateway |
| Which pets belong to this user? | vets_service |
| Is anyone logged in? Where do we send them if not? | the SvelteKit server (`load`, hooks) |
| What does the user see while logging in, and when something goes wrong? | the Svelte page |

---

## Part A — Explore the login (15 min, no Svelte code yet)

Work in pairs. Start the three services. Use a tool for HTTP requests: `curl`, the REST Client
extension in VS Code, Postman or Bruno.

1. Log in as Noor with `POST http://localhost:3000/auth/login` and the body
   `{ "email": "noor@example.com", "password": "supersecret1" }`. What do you get back?
2. Call `GET /my/pets` **without** a token, **with** Noor's token, and with a token where you
   changed one character. Write down the status code and response of each.
3. Paste Noor's token into [jwt.io](https://jwt.io) (this is a dev token, so that's fine). What's
   inside? What *isn't* inside, and why?
4. Register a new account with your own (fake) email and call `/my/pets` with that token. Then
   send the same request again, with an extra header `X-User-Email: noor@example.com`. Do you get
   Roos? Find the line in the gateway that explains the answer.
5. Follow a request for `/my/pets` from the gateway to the database: which files does it pass
   through, and where is the email used?

**Deliverable for Part A:** your answers in `docs/submissions/<your-names>-assignment-5.md`.

## Part B — The login page (20 min)

The login page at `/login` is ready; submitting it now shows *"Logging in is not built yet"*.
Fill in the `TODO`s in
[`routes/login/+page.server.ts`](../../svelte/src/routes/login/+page.server.ts):

1. When the email or password is empty, return `fail(400, …)` with a message in plain language.
2. Send the email and password to `POST {VET_SERVICE_API_URL}/auth/login` (a JSON body).
3. When the login fails, return `fail(…)` with a clear message. A status of `500` or higher
   means the service is unavailable; anything else means the email or password is wrong. (Why
   shouldn't you tell the user *which* of the two was wrong?)
4. Otherwise read the `LoginResponse`, store the token in an httpOnly cookie named `token`, and
   redirect to `/portal`. Remove the temporary `return fail(501, …)`.

Test it:

- Log in with a wrong password: you see your message, and the email is still filled in.
- Log in as Noor: you land on `/portal` (still with dummy data, that's Part C).
- Open DevTools → Application → Cookies. Is the cookie there, with **HttpOnly** checked? Can you
  read it from the console with `document.cookie`? Why (not)?
- Stop auth-service and log in again. Which message do you get?

## Part C — Connect the portal (20 min)

Now replace the dummy data with the real pets of the logged-in user.

1. Read [`hooks.server.ts`](../../svelte/src/hooks.server.ts) (ready-made): it reads the `token`
   cookie on every request and puts it on `event.locals.token`. Where is its type declared? What
   is `locals.token` when nobody is logged in?
2. In [`routes/portal/+page.server.ts`](../../svelte/src/routes/portal/+page.server.ts), redirect to
   `/login` when there is no token.
3. Fetch `GET /my/pets` from the gateway with the header `Authorization: Bearer <token>`. When the
   gateway answers `401` (the token expired or is invalid), delete the cookie and redirect to
   `/login`. On any other error, use `error(503, …)`.
4. Fetch `GET /auth/me` with the same header and return the user's email instead of the dummy
   `portalEmail`. Then remove the dummy import, and `portalEmail` and `pets` from `data.ts`.
   (Tip: you can fetch both at the same time with `Promise.all`.)
5. Log in as Sam and as Lisa. Do you see their pets, and only theirs?

`portal/+page.svelte`, `PortalSection` and `PetCard` should not need to change. If they do, ask
yourself why.

## Part D — Log out (5 min)

The portal already has a "Log out" button: a form (`method="POST"`) that posts to `/logout`.

1. Fill in the `TODO` in [`routes/logout/+page.server.ts`](../../svelte/src/routes/logout/+page.server.ts):
   delete the cookie. The redirect to the homepage is already there.
2. Check that `/portal` sends you to `/login` again after logging out.
3. Why is log out a form and not a link? (Think about what a browser or a link preview does with
   links.)

### Constraints

- **The token never reaches the browser's JavaScript.** It lives in an httpOnly cookie and is
  only read in server code (`hooks.server.ts`, `+page.server.ts`).
- **The frontend never sends an email or user id to get someone's data.** It only sends the
  token.
- **TypeScript everywhere, no `any`.** `event.locals` is typed in `app.d.ts`, API responses have
  an interface. `npm run check` and `npm run build` are clean.
- **Plain language** (see the accessibility requirements in [`design.md`](../design.md)): error
  messages say what to do ("Check your email address and password and try again"), no technical
  jargon like "401".
- **Components stay presentational.** Only `+page.server.ts` files and the hook talk to the API.

## Deliverables

1. Your Part A answers (see above).
2. A branch/PR (or the submission method your instructor specifies) containing:
   - the login action (Part B),
   - the connected portal (Part C),
   - the logout action (Part D),
   - no leftover dummy data that nothing uses,
   - a clean `npm run check` and `npm run build`.
3. In the same `docs/submissions/<your-names>-assignment-5.md`, a short reflection (15–20 lines)
   answering:
   - Why do we keep the token in an httpOnly cookie and not in `localStorage`? Use at least two
     rows from the table in the background section.
   - What goes wrong if the portal asks for `GET /pets?email=…`? Who could abuse it, and how?
   - vets_service trusts the `X-User-Email` header without checking anything. When is that safe,
     and when is it not?

## Grading rubric

| Criterion | Weight |
| --- | --- |
| Login works: form action, `fail()` with clear messages, httpOnly cookie, `redirect()` | 25% |
| Portal shows only the logged-in user's pets, redirects when not (or no longer) logged in | 25% |
| Types: `PageServerLoad`, API interfaces, no `any`; `npm run check` is clean | 15% |
| Reflection shows genuine reasoning about security trade-offs, not a description of the code | 25% |
| Plain-language error messages; logout works | 10% |

## Stretch goals (optional)

For students who finish early:

- **Gateway down, friendly message.** When the gateway isn't running at all, `fetch` throws
  before there is a response, and you get SvelteKit's error page. Catch that case in the login
  action and return a `fail()` message instead. (Careful: keep `redirect()` outside the `try`.)

- **Log in or log out in the header.** Show "Log in" or "Log out" in `SiteHeader`, depending on
  whether someone is logged in. You'll need a `+layout.server.ts` that tells every page. What
  should it return: the token, or something else?
- **Register.** Add a `/register` page that uses `POST /auth/register`. Register with
  `noor@example.com`: what happens, and why is that the right answer?
- **Back to where you were.** When `/portal` redirects to `/login`, remember where the user came
  from (`/login?redirectTo=/portal`) and go back there after logging in. Only allow paths on your
  own site. Why?
- **Protect a group of pages.** Put the portal in a route group like `src/routes/(portal)/` and
  do the login check once in its `+layout.server.ts`. What are the pros and cons compared to a
  check in every `load`?
- **Rename the variable.** `VET_SERVICE_API_URL` now points at the gateway, not at the vets
  service. Rename it to `API_GATEWAY_URL` everywhere, and remove `PUBLIC_VET_SERVICE_API_URL` if
  nothing needs it anymore. Does `AppointmentTypeSelect` still need it?
