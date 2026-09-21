import type { Vet } from '../data';

export interface BookingState {
  selectedVet: Vet | null;
}

// const bookingContextKey = 'booking';

export const bookingState: BookingState = $state({ selectedVet: null });
