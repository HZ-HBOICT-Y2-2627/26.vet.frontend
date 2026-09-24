import { Router } from 'express';
import { vetService } from '../services';
import { createVetInputSchema, updateVetInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const vetsRouter = Router();

vetsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await vetService.getAllVets());
}));

vetsRouter.get('/:id', asyncHandler(async (req, res) => {
  const vet = await vetService.getVetById(Number(req.params.id));
  if (!vet) { res.status(404).json({ error: 'Vet not found' }); return; }
  res.json(vet);
}));

vetsRouter.post('/', asyncHandler(async (req, res) => {
  const input = createVetInputSchema.parse(req.body);
  res.status(201).json(await vetService.createVet(input));
}));

vetsRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateVetInputSchema.parse(req.body);
  res.json(await vetService.updateVet(Number(req.params.id), input));
}));

vetsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await vetService.deleteVet(Number(req.params.id));
  res.status(204).send();
}));
