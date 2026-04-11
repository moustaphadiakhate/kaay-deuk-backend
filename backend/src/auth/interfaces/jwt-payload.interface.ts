export interface JwtPayload {
  sub: number;
  email: string;
  type: 'SUPER_ADMIN' | 'ADMINISTRATEUR';
  iat?: number;
  exp?: number;
}
