import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getDocuments(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const { search, status } = req.query;
  let query = 'SELECT * FROM documents WHERE user_id = ?';
  const params: any[] = [req.userId!];

  if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY uploaded_at DESC';

  sendSuccess(res, db.prepare(query).all(...params));
}

export function uploadDocument(req: AuthenticatedRequest, res: Response): void {
  const { name, type, file_name, file_size_kb } = req.body;
  if (!name || !type) { sendError(res, 'name and type are required'); return; }

  const db = getDb();
  // Check for duplicate name for this user
  const existing = db.prepare('SELECT id FROM documents WHERE user_id = ? AND name = ? AND status != ?').get(req.userId!, name, 'missing') as any;

  if (existing) {
    // Update existing record
    db.prepare('UPDATE documents SET file_name = ?, file_size_kb = ?, status = ?, rejection_reason = NULL, uploaded_at = datetime(\'now\') WHERE id = ?')
      .run(file_name || null, file_size_kb || 0, 'pending', existing.id);
    sendSuccess(res, db.prepare('SELECT * FROM documents WHERE id = ?').get(existing.id));
  } else {
    const result = db.prepare(`
      INSERT INTO documents (user_id, name, type, file_name, file_size_kb, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(req.userId!, name, type, file_name || null, file_size_kb || 0) as any;
    sendSuccess(res, db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid), 201);
  }
}

export function deleteDocument(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.userId!);
  if (!doc) { sendError(res, 'Document not found', 404); return; }
  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
  sendSuccess(res, { message: 'Document deleted' });
}

export function updateDocumentStatus(req: AuthenticatedRequest, res: Response): void {
  const { status, rejection_reason } = req.body;
  const validStatuses = ['verified', 'pending', 'rejected', 'missing'];
  if (!status || !validStatuses.includes(status)) {
    sendError(res, 'Valid status is required: verified | pending | rejected | missing'); return;
  }
  const db = getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!doc) { sendError(res, 'Document not found', 404); return; }
  db.prepare('UPDATE documents SET status = ?, rejection_reason = ? WHERE id = ?').run(status, rejection_reason || null, req.params.id);
  sendSuccess(res, db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id));
}
