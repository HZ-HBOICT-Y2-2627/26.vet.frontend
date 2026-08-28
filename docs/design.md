# Design spec — Kliniek Van Dijk website

This document is the design reference for the case running through this course: a public
website for **Kliniek Van Dijk**, a fictional veterinary practice, based on the stakeholder
interviews in the [veterinarian-case](https://github.com/HZ-HBOICT-UVE-2627/veterinarian-case)
repository.

It describes *what* we're building and *why*. It intentionally does not prescribe a component
structure — figuring out how to break this design into components is the subject of
[Assignment 1](./assignment-1.md).

## 1. Scope

The interviews describe a much bigger problem than a website: practice management software,
lab integration over HL7, stock management, GDPR-compliant record keeping, etc. That full
system is out of scope for this course. We are building the **public-facing website**: the
part a client or prospective client sees in a browser. Concretely, that means:

- A marketing/informational site (who we are, what we treat, opening hours, contact).
- Self-service features clients explicitly asked for: online appointment booking and viewing
  a pet's records.
- It does **not** include the practice's internal tooling (VetBase replacement, lab HL7
  integration, stock management) — those belong to the backend/systems side of the case and
  may return in later assignments.

## 2. Grounding in the interviews

Every feature below traces back to something a stakeholder said. Keep this mapping in mind —
in later lessons you'll be asked to justify design decisions against the source material.

| Feature on the site | Where it comes from |
| --- | --- |
| Online appointment booking, with a "reason for visit" step that determines duration | Dr. van Dijk wants online booking (§"The Online Booking Question"); Jamie's concern that a booking needs a type/duration; Robin's proposed solution — a dropdown mapping visit type to duration |
| Phone number and opening hours prominent on every page, not just buried in a contact page | Noor de Boer will likely still call rather than book online; multi-channel support must remain |
| Client-accessible pet records (vaccination history, treatments) | Noor's story about not knowing Roos's medication history when visiting a specialist |
| Plain language, large text, clear buttons, no pop-ups | Noor's explicit accessibility requests — she is representative of a real client segment (older, low tech-literacy) |
| Visible privacy/GDPR statement, "who can see my information" | Noor's trust concern; Dr. van Dijk's compliance concerns (AVG/GDPR) |
| Exotic animal care called out separately, with limited days | Dr. van Dijk: exotics handled by one colleague, two days a week |
| Team page introducing the vets | Builds trust; supports Jamie's point that clients value the personal relationship, not just a transaction |
| Testimonials | Reinforces trust for a hesitant, non-technical client segment |

Two tensions from the interviews should visibly shape the UI, not just live in a requirements
doc:

1. **Booking must not become a black box.** Jamie's objection to online booking wasn't
   technophobia — it was that a naive "pick a time" form loses information a receptionist
   would normally gather by asking questions. The visit-type step exists specifically to
   address this.
2. **Not everyone will self-serve.** Noor represents clients who will likely never use online
   booking. The phone number must never be hidden behind a "contact us" click — it's in the
   top bar of every page.

## 3. Sitemap

| Page | Priority | Status |
| --- | --- | --- |
| **Home** | MVP | Built as the Lesson 1 starting point (`src/App.svelte`) |
| Services (detail per service) | MVP | Described below, built in a later lesson |
| Our team (detail per vet) | Nice-to-have | Described below, built in a later lesson |
| Book an appointment (full multi-step flow) | MVP | Home has a single-step teaser; the full flow is a later lesson |
| Client portal (pet records) | MVP | Home has a login teaser only; the portal itself is a later lesson |
| Contact / practical info | MVP | Currently folded into the Home page footer + practical info section |

Only **Home** is in scope for Assignment 1. It's built so that it already contains
representative examples of every kind of UI element the later pages will also need (cards,
a form, a data table, a footer) — so the components you extract from it will be reused, not
thrown away.

## 4. Design tokens

Defined in [`src/app.css`](../src/app.css) as Tailwind v4 `@theme` tokens, used via utility
classes like `bg-primary-600` or `text-accent-500`.

| Token | Value | Use |
| --- | --- | --- |
| `primary-50` … `primary-900` | Teal, `#f0fdfa` → `#0a2e2c` | Brand color. Calm, clinical, trustworthy — avoids the "alarming" feel of a bright red/orange medical palette. Used for headers, primary buttons, links. |
| `accent-50` … `accent-600` | Amber, `#fffbeb` → `#d97706` | Warm, approachable counterpoint to the teal — used sparingly, e.g. duration badges on service cards. |
| `font-sans`, `font-heading` | Inter, system-ui fallback stack | One typeface, weight does the work of distinguishing headings from body text — keeps the palette simple for a first component-based project. |

Layout conventions used throughout:

- Content is constrained to `max-w-6xl`, centered, with `px-4` gutters.
- Card-like elements: `rounded-2xl`, `border border-slate-200`, `shadow-sm` (`hover:shadow-md`
  on interactive cards).
- Buttons: fully rounded (`rounded-full`), solid `bg-primary-600` for primary actions,
  outlined `border-primary-600` for secondary actions.

## 5. Homepage

Reference screenshots of the approved design, rendered at desktop and mobile widths:

- Desktop (1440px): [`screenshots/homepage-desktop.png`](./screenshots/homepage-desktop.png)
- Mobile (390px): [`screenshots/homepage-mobile.png`](./screenshots/homepage-mobile.png)

Section by section:

1. **Top bar** — emergency phone number + opening hours summary. Always visible, even when
   scrolled (part of the sticky header area). Non-negotiable per the Noor/Jamie phone-first
   requirement.
2. **Header / navigation** — logo, links to every section, a persistent "Book appointment"
   CTA, collapsing to a hamburger menu below the `md` breakpoint.
3. **Hero** — one clear value proposition, two CTAs (book an appointment / view records) that
   map directly to the two self-service features clients asked for.
4. **Trust strip** — four short stats (years of experience, number of vets, GDPR compliance,
   exotic-animal availability). Cheap to build, does real work building trust for a hesitant
   client segment.
5. **Services** — a grid of cards: icon, name, one-sentence description, an estimated
   duration badge. The duration badge is a direct answer to Jamie's "how does the system know
   how long to book" concern — it's shown to the client too, so expectations are set upfront.
6. **Team** — one card per vet: initials avatar, name, role, one-sentence bio. Deliberately
   simple (no photos yet — a real practice would need consent/GDPR sign-off from staff for
   published photos, which is itself a nice discussion point).
7. **Book an appointment** — a teaser/single-step version of the full booking flow: choose a
   visit type from a dropdown, see the estimated duration update immediately, pick a date.
   The full multi-step flow (with real availability) is out of scope for this lesson.
8. **Client portal teaser** — a single CTA into a login flow that doesn't exist yet. On Home,
   it's a promise, not a feature.
9. **Testimonials** — two short quotes. One is written from Noor's own perspective (records
   access), the other reinforces the booking flexibility angle.
10. **Practical info** — opening hours as a simple table, address, and a map placeholder.
11. **Footer** — sitemap links, contact details, and an explicit link to a privacy policy —
    directly addressing Noor's "I'd want to know who can see my information."

## 6. Other pages (context for later lessons)

These are not built yet, but the Home page's components should be reusable enough that
building these later is mostly composition, not new component design.

- **Services detail** — one page per service: longer description, what to expect, prep
  instructions (e.g. "no food for 12 hours before this test"), a "book this" CTA. Reuses the
  service card and duration badge from Home.
- **Team detail** — one page per vet: longer bio, specialisms, which days they're in.
- **Book an appointment (full flow)** — visit type → date/time → contact details → confirmation,
  with a cancellation/reschedule option (addressing Jamie's no-show concern from the
  interviews).
- **Client portal** — after a (mocked, for course purposes) login: a pet's vaccination
  history, past treatments and medications, in plain language, matching Noor's request.

## 7. Accessibility & inclusive design requirements

These are requirements, not suggestions — they come directly from a real client segment
described in the interviews (Noor: older, low tech-literacy, but a loyal, long-term client):

- Body text at a legible size by default; don't rely on zoom.
- Buttons and links must look clickable (sufficient color contrast, visible focus states) and
  say what they do ("Book an appointment", not "Click here").
- No content that only works on hover (mobile has no hover).
- Every interactive element must be reachable and operable by keyboard.
- No auto-playing pop-ups or interstitials.
- Any link to a privacy/data policy must be easy to find, not buried.

When you extract components in Assignment 1, these requirements travel with the markup —
componentizing must not regress accessibility (e.g. don't drop an `aria-label`, an `alt` text,
or a semantic `<button>` in favor of a `<div onclick>` while refactoring).

## 8. Source of truth

All current copy, data (services, vets, opening hours, testimonials) and markup for the Home
page lives in [`src/App.svelte`](../src/App.svelte). That file *is* the design as currently
implemented — it matches the screenshots above pixel-for-pixel. Treat it as the input to
Assignment 1, not as a rough draft to redesign.
