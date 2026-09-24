// Treatment types
export interface Treatment {
  id: number;
  icon: string;
  title: string;
  description: string;
  duration: string; // e.g. "15 min"
}

export interface TreatmentInput {
  icon: string;
  title: string;
  description: string;
  duration: string;
}

export interface TreatmentUpdateInput {
  icon?: string;
  title?: string;
  description?: string;
  duration?: string;
}

// Vet types
export interface Vet {
  id: number;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface VetInput {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface VetUpdateInput {
  name?: string;
  role?: string;
  bio?: string;
  initials?: string;
}

// Appointment type types
export interface AppointmentType {
  id: number;
  slug: string; // e.g. "vaccination"
  label: string;
  durationMinutes: number;
}

export interface AppointmentTypeInput {
  slug: string;
  label: string;
  durationMinutes: number;
}

export interface AppointmentTypeUpdateInput {
  slug?: string;
  label?: string;
  durationMinutes?: number;
}
