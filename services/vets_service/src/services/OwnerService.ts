import { prisma } from '../lib/prisma';

export class OwnerService {
  // Finds the pets of the owner with this email. An email without an owner
  // (someone who registered but isn't a client yet) simply has no pets.
  async getPetsByOwnerEmail(email: string) {
    try {
      return await prisma.pet.findMany({
        where: { owner: { email } },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch pets: ${error}`);
    }
  }
}

export const ownerService = new OwnerService();
