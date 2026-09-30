import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middleware/errorHandling.js';
import type { JwtPayload } from '../types/index.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class UserService {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Constant-time comparison even when user doesn't exist to prevent timing attacks
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) throw new HttpError(401, 'Invalid credentials');

    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpError(404, 'User not found');
    return { id: user.id, email: user.email, role: user.role };
  }

  private signToken(user: { id: number; email: string; role: string }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }
}
