import { Router } from 'express';
import { appointmentTypeService } from '../services';
import { createAppointmentTypeInputSchema, updateAppointmentTypeInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const appointmentTypesRouter = Router();

appointmentTypesRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await appointmentTypeService.getAllAppointmentTypes());
}));

appointmentTypesRouter.get('/:id', asyncHandler(async (req, res) => {
  const appointmentType = await appointmentTypeService.getAppointmentTypeById(Number(req.params.id));
  if (!appointmentType) { res.status(404).json({ error: 'Appointment type not found' }); return; }
  res.json(appointmentType);
}));

appointmentTypesRouter.post('/', asyncHandler(async (req, res) => {
  const input = createAppointmentTypeInputSchema.parse(req.body);
  res.status(201).json(await appointmentTypeService.createAppointmentType(input));
}));

appointmentTypesRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateAppointmentTypeInputSchema.parse(req.body);
  res.json(await appointmentTypeService.updateAppointmentType(Number(req.params.id), input));
}));

appointmentTypesRouter.delete('/:id', asyncHandler(async (req, res) => {
  await appointmentTypeService.deleteAppointmentType(Number(req.params.id));
  res.status(204).send();
}));
