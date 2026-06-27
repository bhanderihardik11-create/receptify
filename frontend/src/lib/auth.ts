import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from './db/data-source';
import { User } from './db/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const COOKIE_NAME = 'receptify_token';

export interface JwtPayload {
  userId: string;
  email: string;
  businessId: string | null;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function setAuthCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function getUserFromRequest(req?: NextRequest): Promise<User | null> {
  let token: string | undefined;
  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else {
    const c = await cookies();
    token = c.get(COOKIE_NAME)?.value;
  }
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = await getDB();
  const user = await db.getRepository(User).findOne({ where: { id: payload.userId } });
  return user;
}

export async function requireAuth(req?: NextRequest): Promise<User> {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw new AuthError('Unauthorized');
  }
  return user;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
