import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { getDb } from '../db/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendError } from '../utils/response.js';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'No token provided', 401);
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const db = getDb();
    const user = db.prepare(
      'SELECT id, name, email, phone, business_name, business_type, location, avatar_initials, decision_score, created_at, updated_at FROM users WHERE id = ?'
    ).get(payload.userId) as any;

    if (!user) {
      sendError(res, 'User not found', 401);
      return;
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}
