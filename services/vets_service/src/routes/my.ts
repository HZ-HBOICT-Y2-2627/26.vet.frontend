import { Router } from 'express';
import { ownerService } from '../services';
import { asyncHandler } from '../middleware/errorHandling';

// Routes for the logged-in user. This service doesn't check tokens itself:
// the API gateway verifies the token and passes the user's email along in the
// X-User-Email header. That's why this service must only be reached through
// the gateway.
export const myRouter = Router();

myRouter.get('/pets', asyncHandler(async (req, res) => {
  const email = req.header('x-user-email');
  if (!email) { res.status(401).json({ error: 'Not logged in' }); return; }
  res.json(await ownerService.getPetsByOwnerEmail(email));
}));
