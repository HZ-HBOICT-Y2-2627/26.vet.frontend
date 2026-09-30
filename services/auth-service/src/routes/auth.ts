import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandling.js';
import { authenticate } from '../middleware/authenticate.js';
import { UserService } from '../services/UserService.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';

const router = Router();
const userService = new UserService();

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);
  const result = await userService.register(email, password);
  res.status(201).json(result);
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await userService.login(email, password);
  res.json(result);
}));

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await userService.findById(req.user!.sub);
  res.json({ user });
}));

export { router as authRouter };
