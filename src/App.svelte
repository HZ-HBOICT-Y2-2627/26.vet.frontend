<script lang="ts">
  // ------------------------------------------------------------------
  // Kliniek Van Dijk — homepage
  //
  // NOTE FOR STUDENTS: everything on this page — layout, styling, content
  // and interactivity — lives in this one file on purpose. Your assignment
  // is to look at what's here, decide where the natural component
  // boundaries are, and split it up. Nothing here needs to be *rewritten*,
  // it needs to be *reorganised*.
  // ------------------------------------------------------------------

  interface NavLink {
    label: string;
    href: string;
  }

  interface Service {
    icon: string;
    title: string;
    description: string;
    duration: string;
  }

  interface Vet {
    name: string;
    role: string;
    bio: string;
    initials: string;
  }

  interface AppointmentType {
    id: string;
    label: string;
    durationMinutes: number;
  }

  interface OpeningHoursRow {
    day: string;
    hours: string;
  }

  interface Testimonial {
    quote: string;
    author: string;
    detail: string;
  }

  const navLinks: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Our team', href: '#team' },
    { label: 'Book appointment', href: '#book' },
    { label: 'Client portal', href: '#portal' },
    { label: 'Contact', href: '#contact' },
  ];

  const services: Service[] = [
    {
      icon: '💉',
      title: 'Vaccinations',
      description: 'Core and booster vaccinations for dogs, cats, rabbits and guinea pigs, with automatic reminders when the next one is due.',
      duration: '15 min',
    },
    {
      icon: '🩺',
      title: 'General check-up',
      description: 'A full health check for new patients or annual wellness visits.',
      duration: '30 min',
    },
    {
      icon: '🐶',
      title: 'New puppy / kitten consult',
      description: 'First consultation for a new companion: health check, vaccination schedule and advice.',
      duration: '45 min',
    },
    {
      icon: '🦴',
      title: 'Skin & allergy consult',
      description: 'Diagnosis and treatment plans for skin conditions, allergies and chronic itching.',
      duration: '30 min',
    },
    {
      icon: '🔬',
      title: 'Lab diagnostics',
      description: 'Blood work and lab samples, processed with Laboratorium Centraal.',
      duration: '15 min',
    },
    {
      icon: '🦜',
      title: 'Exotic animal consult',
      description: 'Specialised care for exotic pets, available Tuesdays and Thursdays.',
      duration: '30 min',
    },
  ];

  const vets: Vet[] = [
    {
      name: 'Dr. Alex van Dijk',
      role: 'Practice owner & lead veterinarian',
      bio: '18 years of experience with companion animals. Owner of the practice for the past 9 years.',
      initials: 'AvD',
    },
    {
      name: 'Dr. Robin Smits',
      role: 'Veterinarian',
      bio: 'Focuses on general medicine and surgery, with a soft spot for senior pets.',
      initials: 'RS',
    },
    {
      name: 'Dr. Farah El Amrani',
      role: 'Veterinarian',
      bio: 'Specialises in dermatology and allergy-related conditions.',
      initials: 'FE',
    },
    {
      name: 'Dr. Michael de Groot',
      role: 'Exotic animal specialist',
      bio: 'Sees exotic pets — rabbits, birds and reptiles — every Tuesday and Thursday.',
      initials: 'MdG',
    },
  ];

  const appointmentTypes: AppointmentType[] = [
    { id: 'vaccination', label: 'Vaccination', durationMinutes: 15 },
    { id: 'checkup', label: 'General check-up', durationMinutes: 30 },
    { id: 'new-patient', label: 'New puppy / kitten consult', durationMinutes: 45 },
    { id: 'skin', label: 'Skin or allergy issue', durationMinutes: 30 },
    { id: 'follow-up', label: 'Follow-up visit', durationMinutes: 15 },
  ];

  const openingHours: OpeningHoursRow[] = [
    { day: 'Monday – Friday', hours: '08:30 – 18:00' },
    { day: 'Saturday', hours: '09:00 – 13:00' },
    { day: 'Sunday', hours: 'Closed (emergencies: see below)' },
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "I can finally see Benji and Roos' vaccination history myself, without having to call and wait for someone to look it up.",
      author: 'Noor de Boer',
      detail: 'Client for 4 years',
    },
    {
      quote: 'Booking a check-up at ten at night, from my couch, without playing phone tag — exactly what we needed.',
      author: 'M. Kesler',
      detail: 'Client since 2023',
    },
  ];

  let mobileNavOpen = $state(false);
  let selectedAppointmentTypeId = $state(appointmentTypes[0].id);

  const selectedAppointmentType = $derived(
    appointmentTypes.find((type) => type.id === selectedAppointmentTypeId) ?? appointmentTypes[0],
  );
</script>

<div class="min-h-screen bg-white text-slate-800">
  <!-- Top bar: emergency + phone, always visible for the "just let me call someone" client segment -->
  <div class="bg-primary-800 text-primary-50 text-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
      <p>🚨 Animal emergency? Call us directly: <a href="tel:+31101234567" class="font-semibold underline">010 - 123 4567</a></p>
      <p class="hidden sm:block">Mon–Fri 08:30–18:00 · Sat 09:00–13:00</p>
    </div>
  </div>

  <!-- Header / navigation -->
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="#home" class="flex items-center gap-2 text-lg font-bold text-primary-700">
        <span class="text-2xl">🐾</span>
        Kliniek Van Dijk
      </a>

      <nav class="hidden items-center gap-6 md:flex">
        {#each navLinks as link}
          <a href={link.href} class="text-sm font-medium text-slate-600 hover:text-primary-700">
            {link.label}
          </a>
        {/each}
      </nav>

      <a
        href="#book"
        class="hidden rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 md:inline-block"
      >
        Book appointment
      </a>

      <button
        class="text-2xl md:hidden"
        aria-label="Toggle navigation menu"
        onclick={() => (mobileNavOpen = !mobileNavOpen)}
      >
        {mobileNavOpen ? '✕' : '☰'}
      </button>
    </div>

    {#if mobileNavOpen}
      <nav class="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
        {#each navLinks as link}
          <a
            href={link.href}
            class="rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-700"
            onclick={() => (mobileNavOpen = false)}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    {/if}
  </header>

  <!-- Hero -->
  <section id="home" class="bg-primary-50">
    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 class="text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
          Caring for your best friend, on your schedule.
        </h1>
        <p class="mt-4 text-lg text-slate-600">
          Book appointments online, see your pet's records whenever you need them, and reach
          us by phone whenever you'd rather talk to a person. Kliniek Van Dijk has been caring
          for dogs, cats, rabbits and more for over 18 years.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a
            href="#book"
            class="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            Book an appointment
          </a>
          <a
            href="#portal"
            class="rounded-full border border-primary-600 px-6 py-3 font-semibold text-primary-700 hover:bg-primary-100"
          >
            View my pet's records
          </a>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="flex h-64 w-64 items-center justify-center rounded-full bg-primary-100 text-8xl md:h-80 md:w-80">
          🐶🐱
        </div>
      </div>
    </div>
  </section>

  <!-- Trust strip -->
  <section class="border-y border-slate-200 bg-white">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4">
      <div>
        <p class="text-3xl font-bold text-primary-700">18+</p>
        <p class="text-sm text-slate-500">years of experience</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-primary-700">4</p>
        <p class="text-sm text-slate-500">dedicated veterinarians</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-primary-700">GDPR</p>
        <p class="text-sm text-slate-500">compliant data handling</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-primary-700">2x</p>
        <p class="text-sm text-slate-500">weekly exotic animal care</p>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section id="services" class="mx-auto max-w-6xl px-4 py-16">
    <h2 class="text-center text-3xl font-bold text-primary-900">What we treat</h2>
    <p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
      From routine vaccinations to specialist exotic animal care — choose a service below to see
      how long an appointment typically takes.
    </p>

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each services as service}
        <div class="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md">
          <div class="text-3xl">{service.icon}</div>
          <h3 class="mt-4 text-lg font-semibold text-slate-900">{service.title}</h3>
          <p class="mt-2 text-sm text-slate-600">{service.description}</p>
          <span
            class="mt-4 inline-block rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-600"
          >
            ~{service.duration}
          </span>
        </div>
      {/each}
    </div>
  </section>

  <!-- Team -->
  <section id="team" class="bg-slate-50 py-16">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-center text-3xl font-bold text-primary-900">Meet the team</h2>
      <p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        Four veterinarians, three veterinary assistants and a front desk that actually knows your
        pet's name.
      </p>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each vets as vet}
          <div class="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div
              class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white"
            >
              {vet.initials}
            </div>
            <h3 class="mt-4 font-semibold text-slate-900">{vet.name}</h3>
            <p class="text-sm font-medium text-primary-700">{vet.role}</p>
            <p class="mt-2 text-sm text-slate-600">{vet.bio}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Book appointment -->
  <section id="book" class="mx-auto max-w-6xl px-4 py-16">
    <div class="grid gap-10 md:grid-cols-2">
      <div>
        <h2 class="text-3xl font-bold text-primary-900">Book an appointment</h2>
        <p class="mt-3 text-slate-600">
          Tell us what the visit is about and we'll reserve the right amount of time — the same
          way our front desk does over the phone.
        </p>

        <ol class="mt-6 space-y-4">
          <li class="flex gap-3">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">1</span>
            <span class="text-sm text-slate-700">Choose the reason for your visit.</span>
          </li>
          <li class="flex gap-3">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">2</span>
            <span class="text-sm text-slate-700">Pick a date and time that works for you.</span>
          </li>
          <li class="flex gap-3">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">3</span>
            <span class="text-sm text-slate-700">Confirm — we'll send you a reminder before your visit.</span>
          </li>
        </ol>
      </div>

      <div class="rounded-2xl border border-slate-200 p-6 shadow-sm">
        <label for="appointment-type" class="text-sm font-semibold text-slate-700">
          What is the visit for?
        </label>
        <select
          id="appointment-type"
          class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          bind:value={selectedAppointmentTypeId}
        >
          {#each appointmentTypes as type}
            <option value={type.id}>{type.label}</option>
          {/each}
        </select>

        <p class="mt-3 text-sm text-slate-500">
          Estimated duration: <span class="font-semibold text-primary-700">{selectedAppointmentType.durationMinutes} minutes</span>
        </p>

        <label for="appointment-date" class="mt-4 block text-sm font-semibold text-slate-700">
          Preferred date
        </label>
        <input
          id="appointment-date"
          type="date"
          class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <button
          type="button"
          class="mt-6 w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Check availability
        </button>

        <p class="mt-3 text-center text-xs text-slate-500">
          Prefer to talk to someone? Call <a href="tel:+31101234567" class="underline">010 - 123 4567</a>.
        </p>
      </div>
    </div>
  </section>

  <!-- Client portal teaser -->
  <section id="portal" class="bg-primary-800 py-16 text-primary-50">
    <div class="mx-auto max-w-6xl px-4 text-center">
      <h2 class="text-3xl font-bold">Your pet's records, whenever you need them</h2>
      <p class="mx-auto mt-3 max-w-2xl text-primary-100">
        Vaccination history, treatments and medication — available online, in plain language, no
        technical jargon.
      </p>
      <a
        href="#portal-login"
        class="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-primary-800 hover:bg-primary-100"
      >
        Log in to the client portal
      </a>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="mx-auto max-w-6xl px-4 py-16">
    <h2 class="text-center text-3xl font-bold text-primary-900">What our clients say</h2>
    <div class="mt-10 grid gap-6 md:grid-cols-2">
      {#each testimonials as testimonial}
        <figure class="rounded-2xl border border-slate-200 p-6 shadow-sm">
          <blockquote class="text-slate-700">"{testimonial.quote}"</blockquote>
          <figcaption class="mt-4 text-sm font-semibold text-slate-900">
            {testimonial.author}
            <span class="block text-xs font-normal text-slate-500">{testimonial.detail}</span>
          </figcaption>
        </figure>
      {/each}
    </div>
  </section>

  <!-- Practical info -->
  <section class="bg-slate-50 py-16">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
      <div>
        <h2 class="text-2xl font-bold text-primary-900">Opening hours</h2>
        <table class="mt-4 w-full text-sm">
          <tbody>
            {#each openingHours as row}
              <tr class="border-b border-slate-200">
                <td class="py-2 font-medium text-slate-700">{row.day}</td>
                <td class="py-2 text-right text-slate-600">{row.hours}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-primary-900">Find us</h2>
        <p class="mt-4 text-sm text-slate-600">Dorpsstraat 42, 4331 AB Middelburg</p>
        <div class="mt-4 flex h-40 items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-500">
          Map placeholder
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contact" class="bg-slate-900 py-12 text-slate-300">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <p class="flex items-center gap-2 text-lg font-bold text-white">
          <span class="text-2xl">🐾</span>
          Kliniek Van Dijk
        </p>
        <p class="mt-3 text-sm">Caring for companion animals since 2008.</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-white">Navigate</h3>
        <ul class="mt-3 space-y-2 text-sm">
          {#each navLinks as link}
            <li><a href={link.href} class="hover:text-white">{link.label}</a></li>
          {/each}
        </ul>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-white">Contact</h3>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a href="tel:+31101234567" class="hover:text-white">010 - 123 4567</a></li>
          <li><a href="mailto:info@kliniekvandijk.nl" class="hover:text-white">info@kliniekvandijk.nl</a></li>
          <li>Dorpsstraat 42, Middelburg</li>
        </ul>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-white">Privacy</h3>
        <p class="mt-3 text-sm">
          We handle your data under the GDPR/AVG. Read our
          <a href="#privacy-policy" class="underline hover:text-white">privacy policy</a> to see who can access
          your information.
        </p>
      </div>
    </div>

    <p class="mt-10 text-center text-xs text-slate-500">
      © 2026 Kliniek Van Dijk. All rights reserved.
    </p>
  </footer>
</div>
