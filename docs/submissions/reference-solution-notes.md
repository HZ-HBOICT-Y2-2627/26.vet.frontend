# Reference solution — Assignment 1

Branch: `solution/lesson-1`. This is an instructor reference solution, not a student
submission — kept here so student trees can be discussed against a concrete example, not an
abstract ideal.

## Final component tree

```text
App.svelte (page)
├─ SiteHeader (organism)          — top bar + nav + mobile menu
│  ├─ NavLink × N (atom)
│  └─ Button (atom)
├─ HeroSection (organism)
│  └─ Button × 2 (atom)
├─ TrustStrip (organism)
│  └─ TrustStatItem × 4 (atom)
├─ ServicesSection (organism)
│  └─ ServiceCard × 6 (molecule)
│     └─ Badge (atom)
├─ TeamSection (organism)
│  └─ VetCard × 4 (molecule)
├─ BookingSection (organism)
│  └─ AppointmentTypeSelect (molecule)
├─ PortalTeaserSection (organism)
│  └─ Button (atom)
├─ TestimonialsSection (organism)
│  └─ TestimonialCard × 2 (molecule)
├─ PracticalInfoSection (organism)
│  └─ OpeningHoursTable (molecule)
└─ SiteFooter (organism)
   └─ NavLink × N (atom)
```

Data (`services`, `vets`, `appointmentTypes`, `openingHours`, `testimonials`, `navLinks`,
`trustStats`) lives in `src/lib/data.ts` and is imported once, in `App.svelte`, then passed
down as props. Every organism/molecule below `App.svelte` is presentational — none of them
import `data.ts` directly. This is a design choice, not the only valid one; see below.

## Decisions worth discussing with students

**Why pass data down instead of letting each section import from `data.ts` directly?**
Both work. Importing directly is less typing. Passing props down means every section
component could be reused with different data (e.g. a Services *page* reusing `ServiceCard`
with a different list) without touching its internals, and it's obvious from `App.svelte`
alone what data the page depends on. For a six-array page like this one, either is
defensible — if students argued for direct imports, that's a reasonable position, not a
mistake.

**Why is `AppointmentTypeSelect` the only component with its own state?**
Because it's the only piece of the page with real interaction logic (a selection driving a
derived value). Everything else is a pure function of its props. This is intentional and
worth pointing out: most components in most UIs are "dumb" — state should be rare and
localized, not sprinkled through the tree.

**Why does `Button` not cover the "Check availability" button?**
`Button` renders an `<a>`. "Check availability" is a `<button type="button">` — different
element, different semantics (it doesn't navigate, it will eventually submit/trigger an
action). Forcing both through one component would mean branching on element type inside
`Button`, which buys nothing here since there's exactly one plain button on the page. If a
student built a polymorphic `Button` that renders `<a>` or `<button>` based on a prop, that's
a legitimate stretch-goal-level solution — flag it as such, not as "more correct."

**A documented, intentional visual tweak.** The original hero CTA had a one-off `shadow-sm`
that no other button on the page had (not the header CTA, not the outline button, not the
portal button). It looked like an unintentional inconsistency rather than a deliberate design
signal, so the shared `Button` atom drops it everywhere rather than adding a one-off `shadow`
prop for a single occurrence. This is the kind of small, real discrepancy componentizing
tends to surface — the right response is to document it (here) and make a call, not to
silently let it drift, and not to over-engineer a prop to preserve an inconsistency nobody
asked for.

**Where "no visual regression" was checked.** `docs/screenshots/homepage-desktop.png` and
`homepage-mobile.png` were compared against renders of this branch at the same widths, plus
the mobile menu open state and a changed appointment-type selection (to confirm the extracted
state still drives the derived duration text correctly). All matched, aside from the
documented shadow removal above.

## What this is not

This tree is not "the" answer. A tree that additionally extracted a `Card` atom underneath
`ServiceCard`/`VetCard`/`TestimonialCard` (they all share `rounded-2xl border p-6 shadow-sm`)
would be equally defensible — it wasn't done here because the three cards' internal layout
differs enough (icon+badge vs. avatar vs. quote+figcaption) that the shared `Card` would only
factor out a class string, not real structure. That's a good discussion prompt: when is a
shared visual pattern worth a component, versus just a repeated Tailwind class string?
