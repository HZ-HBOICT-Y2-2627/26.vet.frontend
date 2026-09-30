export type Role = 'USER' | 'ADMIN';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
