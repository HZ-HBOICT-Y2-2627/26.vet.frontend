import { VetInput, VetUpdateInput } from '../types';
import { prisma } from '../lib/prisma';

export class VetService {
  async getAllVets() {
    try {
      return await prisma.vet.findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch vets: ${error}`);
    }
  }

  async getVetById(id: number) {
    try {
      return await prisma.vet.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch vet: ${error}`);
    }
  }

  async createVet(input: VetInput) {
    try {
      return await prisma.vet.create({
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to create vet: ${error}`);
    }
  }

  async updateVet(id: number, input: VetUpdateInput) {
    try {
      return await prisma.vet.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to update vet: ${error}`);
    }
  }

  async deleteVet(id: number) {
    try {
      await prisma.vet.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete vet: ${error}`);
    }
  }
}

export const vetService = new VetService();
