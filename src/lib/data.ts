// Single source of truth for the homepage's content.
// The page (App.svelte) reads this data and hands it down to the
// components that render it — components themselves stay presentational.

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  duration: string;
}

export interface Vet {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface AppointmentType {
  id: string;
  label: string;
  durationMinutes: number;
}

export interface OpeningHoursRow {
  day: string;
  hours: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  detail: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Our team', href: '#team' },
  { label: 'Book appointment', href: '#book' },
  { label: 'Client portal', href: '#portal' },
  { label: 'Contact', href: '#contact' },
];

export const services: Service[] = [
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

export const vets: Vet[] = [
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

export const appointmentTypes: AppointmentType[] = [
  { id: 'vaccination', label: 'Vaccination', durationMinutes: 15 },
  { id: 'checkup', label: 'General check-up', durationMinutes: 30 },
  { id: 'new-patient', label: 'New puppy / kitten consult', durationMinutes: 45 },
  { id: 'skin', label: 'Skin or allergy issue', durationMinutes: 30 },
  { id: 'follow-up', label: 'Follow-up visit', durationMinutes: 15 },
];

export const openingHours: OpeningHoursRow[] = [
  { day: 'Monday – Friday', hours: '08:30 – 18:00' },
  { day: 'Saturday', hours: '09:00 – 13:00' },
  { day: 'Sunday', hours: 'Closed (emergencies: see below)' },
];

export const testimonials: Testimonial[] = [
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

export const trustStats: TrustStat[] = [
  { value: '18+', label: 'years of experience' },
  { value: '4', label: 'dedicated veterinarians' },
  { value: 'GDPR', label: 'compliant data handling' },
  { value: '2x', label: 'weekly exotic animal care' },
];

export const emergencyPhone = { display: '010 - 123 4567', href: 'tel:+31101234567' };
