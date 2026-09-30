// Single source of truth for the homepage's content.

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

export interface Pet {
  name: string;
  species: string;
  breed: string;
  birthDate: string; // "YYYY-MM-DD"
}

export interface Owner {
  name: string;
  email: string; // the same email the owner uses to log in
  phone: string;
  pets: Pet[];
}

export interface AppointmentType {
  id: string;
  label: string;
  durationMinutes: number;
}

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

// Dummy clients for the client portal. Log in with one of these emails to see
// that owner's pets.
export const owners: Owner[] = [
  {
    name: 'Noor de Boer',
    email: 'noor@example.com',
    phone: '06 12345678',
    pets: [
      { name: 'Roos', species: 'Cat', breed: 'British Shorthair', birthDate: '2012-04-18' },
    ],
  },
  {
    name: 'Sam Jansen',
    email: 'sam@example.com',
    phone: '06 23456789',
    pets: [
      { name: 'Max', species: 'Dog', breed: 'Labrador Retriever', birthDate: '2019-09-02' },
      { name: 'Pip', species: 'Rabbit', breed: 'Dutch', birthDate: '2023-03-11' },
    ],
  },
  {
    name: 'Lisa Bakker',
    email: 'lisa@example.com',
    phone: '06 34567890',
    pets: [
      { name: 'Olaf', species: 'Guinea pig', breed: 'Abyssinian', birthDate: '2024-06-25' },
      { name: 'Saar', species: 'Guinea pig', breed: 'Teddy', birthDate: '2024-06-25' },
    ],
  },
];
