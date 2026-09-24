import { AppointmentTypeInput, AppointmentTypeUpdateInput } from '../types';
import { prisma } from '../lib/prisma';

export class AppointmentTypeService {
  async getAllAppointmentTypes() {
    try {
      return await prisma.appointmentType.findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch appointment types: ${error}`);
    }
  }

  async getAppointmentTypeById(id: number) {
    try {
      return await prisma.appointmentType.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch appointment type: ${error}`);
    }
  }

  async createAppointmentType(input: AppointmentTypeInput) {
    try {
      return await prisma.appointmentType.create({
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to create appointment type: ${error}`);
    }
  }

  async updateAppointmentType(id: number, input: AppointmentTypeUpdateInput) {
    try {
      return await prisma.appointmentType.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      throw new Error(`Failed to update appointment type: ${error}`);
    }
  }

  async deleteAppointmentType(id: number) {
    try {
      await prisma.appointmentType.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete appointment type: ${error}`);
    }
  }
}

export const appointmentTypeService = new AppointmentTypeService();
