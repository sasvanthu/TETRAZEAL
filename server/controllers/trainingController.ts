import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getModules(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const modules = db.prepare(`
    SELECT m.*, COALESCE(p.progress, 0) as progress, COALESCE(p.status, 'not-started') as user_status,
           p.started_at, p.completed_at
    FROM training_modules m
    LEFT JOIN user_module_progress p ON p.module_id = m.id AND p.user_id = ?
    ORDER BY m.order_index ASC
  `).all(req.userId!);
  sendSuccess(res, modules);
}

export function getModule(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const module = db.prepare(`
    SELECT m.*, COALESCE(p.progress, 0) as progress, COALESCE(p.status, 'not-started') as user_status
    FROM training_modules m
    LEFT JOIN user_module_progress p ON p.module_id = m.id AND p.user_id = ?
    WHERE m.id = ?
  `).get(req.userId!, req.params.id);
  if (!module) { sendError(res, 'Module not found', 404); return; }
  sendSuccess(res, module);
}

export function updateProgress(req: AuthenticatedRequest, res: Response): void {
  const { progress } = req.body;
  if (progress === undefined || progress < 0 || progress > 100) {
    sendError(res, 'progress must be a number between 0 and 100'); return;
  }

  const db = getDb();
  const module = db.prepare('SELECT * FROM training_modules WHERE id = ?').get(req.params.id);
  if (!module) { sendError(res, 'Module not found', 404); return; }

  const numericProgress = Number(progress);
  const status = numericProgress === 100 ? 'completed' : numericProgress > 0 ? 'in-progress' : 'not-started';
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO user_module_progress (user_id, module_id, progress, status, started_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, module_id) DO UPDATE SET
      progress = excluded.progress,
      status = excluded.status,
      started_at = COALESCE(started_at, excluded.started_at),
      completed_at = excluded.completed_at
  `).run(
    req.userId!, req.params.id, numericProgress, status,
    numericProgress > 0 ? now : null,
    numericProgress === 100 ? now : null
  );

  const updated = db.prepare(`
    SELECT m.*, p.progress, p.status as user_status, p.started_at, p.completed_at
    FROM training_modules m
    JOIN user_module_progress p ON p.module_id = m.id
    WHERE m.id = ? AND p.user_id = ?
  `).get(req.params.id, req.userId!);
  sendSuccess(res, updated);
}

export function getTrainingSummary(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const summary = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
      ROUND(AVG(progress), 0) as avg_progress
    FROM user_module_progress
    WHERE user_id = ?
  `).get(req.userId!);
  sendSuccess(res, summary);
}
