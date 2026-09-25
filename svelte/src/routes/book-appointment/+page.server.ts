import { error } from '@sveltejs/kit';
import { VET_SERVICE_API_URL } from '$env/static/private';
import type { Vet } from '$lib/data';
import type { PageServerLoad } from './$types';

const vets: Vet[] = [
  {
    id: 1,
    name: 'Dr. Alex van Dijk',
    role: 'Practice owner & lead veterinarian',
    bio: '18 years of experience with companion animals. Owner of the practice for the past 9 years.',
    initials: 'AvD',
  },
  {
    id: 2,
    name: 'Dr. Robin Smits',
    role: 'Veterinarian',
    bio: 'Focuses on general medicine and surgery, with a soft spot for senior pets.',
    initials: 'RS',
  },
  {
    id: 3,
    name: 'Dr. Farah El Amrani',
    role: 'Veterinarian',
    bio: 'Specialises in dermatology and allergy-related conditions.',
    initials: 'FE',
  },
  {
    id: 4,
    name: 'Dr. Michael de Groot',
    role: 'Exotic animal specialist',
    bio: 'Sees exotic pets — rabbits, birds and reptiles — every Tuesday and Thursday.',
    initials: 'MdG',
  },
];

export const load: PageServerLoad = async ({ fetch }) => {
  return { vets };
};