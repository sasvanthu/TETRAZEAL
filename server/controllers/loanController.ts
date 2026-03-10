import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { calculateEMI, generateEMISchedule } from '../utils/emi.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getLoans(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const loans = db.prepare('SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC').all(req.userId!);
  sendSuccess(res, loans);
}

export function getLoan(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const loan = db.prepare('SELECT * FROM loans WHERE id = ? AND user_id = ?').get(req.params.id, req.userId!) as any;
  if (!loan) { sendError(res, 'Loan not found', 404); return; }

  const emis = db.prepare('SELECT * FROM emi_records WHERE loan_id = ? ORDER BY due_date ASC').all(loan.id);
  sendSuccess(res, { ...loan, emi_schedule: emis });
}

export function createLoan(req: AuthenticatedRequest, res: Response): void {
  const { title, bank_name, principal, interest_rate, tenure_months, start_date } = req.body;
  if (!title || !bank_name || !principal || !interest_rate || !tenure_months || !start_date) {
    sendError(res, 'title, bank_name, principal, interest_rate, tenure_months, start_date are required');
    return;
  }

  const emi = calculateEMI(Number(principal), Number(interest_rate), Number(tenure_months));
  const db = getDb();

  const result = db.prepare(`
    INSERT INTO loans (user_id, title, bank_name, principal, interest_rate, tenure_months, start_date, emi_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `).run(req.userId!, title, bank_name, principal, interest_rate, tenure_months, start_date, emi) as any;

  const loanId = result.lastInsertRowid as number;

  // Generate EMI schedule
  const schedule = generateEMISchedule(loanId, emi, Number(tenure_months), start_date);
  const insertEMI = db.prepare('INSERT INTO emi_records (loan_id, due_date, amount, status) VALUES (?, ?, ?, ?)');
  for (const entry of schedule) {
    insertEMI.run(entry.loan_id, entry.due_date, entry.amount, entry.status);
  }

  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(loanId);
  sendSuccess(res, loan, 201);
}

export function updateLoan(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const loan = db.prepare('SELECT * FROM loans WHERE id = ? AND user_id = ?').get(req.params.id, req.userId!) as any;
  if (!loan) { sendError(res, 'Loan not found', 404); return; }

  const { title, bank_name, status } = req.body;
  db.prepare('UPDATE loans SET title = COALESCE(?, title), bank_name = COALESCE(?, bank_name), status = COALESCE(?, status) WHERE id = ?')
    .run(title ?? null, bank_name ?? null, status ?? null, loan.id);

  sendSuccess(res, db.prepare('SELECT * FROM loans WHERE id = ?').get(loan.id));
}

export function deleteLoan(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const loan = db.prepare('SELECT * FROM loans WHERE id = ? AND user_id = ?').get(req.params.id, req.userId!);
  if (!loan) { sendError(res, 'Loan not found', 404); return; }

  db.prepare('DELETE FROM loans WHERE id = ?').run(req.params.id);
  sendSuccess(res, { message: 'Loan deleted' });
}

export function markEMIPaid(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const emi = db.prepare(`
    SELECT er.* FROM emi_records er
    JOIN loans l ON l.id = er.loan_id
    WHERE er.id = ? AND l.user_id = ?
  `).get(req.params.emiId, req.userId!) as any;
  if (!emi) { sendError(res, 'EMI record not found', 404); return; }

  const today = new Date().toISOString().split('T')[0];
  db.prepare('UPDATE emi_records SET status = ?, paid_date = ? WHERE id = ?').run('paid', today, emi.id);
  db.prepare('UPDATE loans SET paid_emis = paid_emis + 1 WHERE id = ?').run(emi.loan_id);

  sendSuccess(res, db.prepare('SELECT * FROM emi_records WHERE id = ?').get(emi.id));
}

export function calculateEMIPreview(req: AuthenticatedRequest, res: Response): void {
  const { principal, interest_rate, tenure_months } = req.query;
  if (!principal || !interest_rate || !tenure_months) {
    sendError(res, 'principal, interest_rate, tenure_months are required');
    return;
  }
  const p = Number(principal);
  const r = Number(interest_rate);
  const n = Number(tenure_months);
  const emi = calculateEMI(p, r, n);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - p;
  sendSuccess(res, { emi, totalAmount, totalInterest, principal: p, interest_rate: r, tenure_months: n });
}
