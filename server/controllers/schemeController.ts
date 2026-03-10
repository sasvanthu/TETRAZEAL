import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getSchemes(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const { search, category } = req.query;
  let query = 'SELECT * FROM gov_schemes WHERE 1=1';
  const params: any[] = [];

  if (search) { query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY match_score DESC';

  const schemes = db.prepare(query).all(...params).map((s: any) => ({
    ...s,
    eligibility: JSON.parse(s.eligibility),
    tags: JSON.parse(s.tags),
  }));
  sendSuccess(res, schemes);
}

export function getScheme(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const scheme = db.prepare('SELECT * FROM gov_schemes WHERE id = ?').get(req.params.id) as any;
  if (!scheme) { sendError(res, 'Scheme not found', 404); return; }
  sendSuccess(res, { ...scheme, eligibility: JSON.parse(scheme.eligibility), tags: JSON.parse(scheme.tags) });
}

export function getCategories(_req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const categories = db.prepare('SELECT DISTINCT category FROM gov_schemes ORDER BY category').all();
  sendSuccess(res, categories.map((c: any) => c.category));
}
