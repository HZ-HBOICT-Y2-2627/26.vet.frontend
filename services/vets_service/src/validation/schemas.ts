import { z } from 'zod';

// Treatment validation schemas
export const createTreatmentInputSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
});

export const updateTreatmentInputSchema = z.object({
  icon: z.string().min(1, 'Icon cannot be empty').optional(),
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  duration: z.string().min(1, 'Duration cannot be empty').optional(),
});

// Vet validation schemas
export const createVetInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().min(1, 'Bio is required'),
  initials: z.string().min(1, 'Initials are required'),
});

export const updateVetInputSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  role: z.string().min(1, 'Role cannot be empty').optional(),
  bio: z.string().min(1, 'Bio cannot be empty').optional(),
  initials: z.string().min(1, 'Initials cannot be empty').optional(),
});

// Appointment type validation schemas
export const createAppointmentTypeInputSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  label: z.string().min(1, 'Label is required'),
  durationMinutes: z.number().int().min(1),
});

export const updateAppointmentTypeInputSchema = z.object({
  slug: z.string().min(1, 'Slug cannot be empty').optional(),
  label: z.string().min(1, 'Label cannot be empty').optional(),
  durationMinutes: z.number().int().min(1).optional(),
});

// Type exports for TypeScript
export type CreateTreatmentInput = z.infer<typeof createTreatmentInputSchema>;
export type UpdateTreatmentInput = z.infer<typeof updateTreatmentInputSchema>;
export type CreateVetInput = z.infer<typeof createVetInputSchema>;
export type UpdateVetInput = z.infer<typeof updateVetInputSchema>;
export type CreateAppointmentTypeInput = z.infer<typeof createAppointmentTypeInputSchema>;
export type UpdateAppointmentTypeInput = z.infer<typeof updateAppointmentTypeInputSchema>;
