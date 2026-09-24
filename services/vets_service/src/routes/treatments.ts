import { Router } from 'express';
import { treatmentService } from '../services';
import { createTreatmentInputSchema, updateTreatmentInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const treatmentsRouter = Router();

treatmentsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await treatmentService.getAllTreatments());
}));

treatmentsRouter.get('/:id', asyncHandler(async (req, res) => {
  const treatment = await treatmentService.getTreatmentById(Number(req.params.id));
  if (!treatment) { res.status(404).json({ error: 'Treatment not found' }); return; }
  res.json(treatment);
}));

treatmentsRouter.post('/', asyncHandler(async (req, res) => {
  const input = createTreatmentInputSchema.parse(req.body);
  res.status(201).json(await treatmentService.createTreatment(input));
}));

treatmentsRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateTreatmentInputSchema.parse(req.body);
  res.json(await treatmentService.updateTreatment(Number(req.params.id), input));
}));

treatmentsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await treatmentService.deleteTreatment(Number(req.params.id));
  res.status(204).send();
}));
