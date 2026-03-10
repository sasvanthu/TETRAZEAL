import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getProfile(req: AuthenticatedRequest, res: Response): void {
  sendSuccess(res, req.user);
}

export function updateProfile(req: AuthenticatedRequest, res: Response): void {
  const { name, phone, business_name, business_type, location } = req.body;
  const db = getDb();
  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      business_name = COALESCE(?, business_name),
      business_type = COALESCE(?, business_type),
      location = COALESCE(?, location),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(name ?? null, phone ?? null, business_name ?? null, business_type ?? null, location ?? null, req.userId!);

  const updated = db.prepare(
    'SELECT id, name, email, phone, business_name, business_type, location, avatar_initials, decision_score, created_at, updated_at FROM users WHERE id = ?'
  ).get(req.userId!);
  sendSuccess(res, updated);
}

export function changePassword(req: AuthenticatedRequest, res: Response): void {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    sendError(res, 'current_password and new_password are required'); return;
  }
  if (new_password.length < 6) {
    sendError(res, 'New password must be at least 6 characters'); return;
  }

  const db = getDb();
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.userId!) as any;
  if (!bcrypt.compareSync(current_password, user.password_hash)) {
    sendError(res, 'Current password is incorrect', 401); return;
  }

  const new_hash = bcrypt.hashSync(new_password, 10);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(new_hash, req.userId!);
  sendSuccess(res, { message: 'Password updated successfully' });
}

export function deleteAccount(req: AuthenticatedRequest, res: Response): void {
  const { password } = req.body;
  if (!password) { sendError(res, 'password is required to confirm account deletion'); return; }

  const db = getDb();
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.userId!) as any;
  if (!bcrypt.compareSync(password, user.password_hash)) {
    sendError(res, 'Incorrect password', 401); return;
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(req.userId!);
  sendSuccess(res, { message: 'Account deleted' });
}
