import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database.js';
import { signToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function register(req: AuthenticatedRequest, res: Response): void {
  const { name, email, password, phone, business_name, business_type, location } = req.body;

  if (!name || !email || !password) {
    sendError(res, 'name, email, and password are required');
    return;
  }
  if (password.length < 6) {
    sendError(res, 'Password must be at least 6 characters');
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    sendError(res, 'Email already registered', 409);
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, business_name, business_type, location, avatar_initials)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, email, password_hash, phone || null, business_name || null, business_type || null, location || null, initials) as any;

  const token = signToken(result.lastInsertRowid as number);
  sendSuccess(res, { token, userId: result.lastInsertRowid }, 201);
}

export function login(req: AuthenticatedRequest, res: Response): void {
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(res, 'email and password are required');
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    sendError(res, 'Invalid credentials', 401);
    return;
  }

  const token = signToken(user.id);
  const { password_hash, ...safeUser } = user;
  sendSuccess(res, { token, user: safeUser });
}

export function getMe(req: AuthenticatedRequest, res: Response): void {
  sendSuccess(res, req.user);
}
