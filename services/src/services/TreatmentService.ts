import { TreatmentInput, TreatmentUpdateInput } from '../types';
import { prisma } from '../lib/prisma';

export class TreatmentService {
  async getAllTreatments() {
    try {
      return await prisma.treatment.findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch treatments: ${error}`);
    }
  }

  async getTreatmentById(id: number) {
    try {
      return await prisma.treatment.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch treatment: ${error}`);
    }
  }

  async createTreatment(input: TreatmentInput) {
    try {
      return await prisma.treatment.create({
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to create treatment: ${error}`);
    }
  }

  async updateTreatment(id: number, input: TreatmentUpdateInput) {
    try {
      return await prisma.treatment.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to update treatment: ${error}`);
    }
  }

  async deleteTreatment(id: number) {
    try {
      await prisma.treatment.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete treatment: ${error}`);
    }
  }
}

export const treatmentService = new TreatmentService();
