import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getDashboard(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const userId = req.userId!;

  // Active loans summary
  const activeLoans = db.prepare(`
    SELECT id, title, bank_name, principal, interest_rate, tenure_months, emi_amount, paid_emis, start_date
    FROM loans WHERE user_id = ? AND status = 'active'
  `).all(userId) as any[];

  const totalLoanAmount = activeLoans.reduce((s, l) => s + l.principal, 0);
  const totalPaid = activeLoans.reduce((s, l) => s + l.emi_amount * l.paid_emis, 0);
  const remainingBalance = activeLoans.reduce((s, l) => s + (l.principal - l.emi_amount * l.paid_emis), 0);
  const paidPercent = totalLoanAmount > 0 ? Math.round((totalPaid / (totalLoanAmount * 1.2)) * 100) : 0; // rough estimate

  // Next EMI due
  const nextEMI = db.prepare(`
    SELECT er.due_date, er.amount, l.title, l.bank_name
    FROM emi_records er
    JOIN loans l ON l.id = er.loan_id
    WHERE l.user_id = ? AND er.status = 'pending'
    ORDER BY er.due_date ASC
    LIMIT 1
  `).get(userId) as any;

  // Training progress summary
  const progressStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress
    FROM user_module_progress
    WHERE user_id = ?
  `).get(userId) as any;

  // Cashflow last 6 months
  const cashflow = db.prepare(`
    SELECT month, inflow, outflow FROM cashflow_entries
    WHERE user_id = ?
    ORDER BY month DESC LIMIT 6
  `).all(userId);

  // Upcoming actions
  const pendingDocs = db.prepare(`
    SELECT COUNT(*) as count FROM documents WHERE user_id = ? AND status IN ('pending','missing')
  `).get(userId) as any;

  sendSuccess(res, {
    user: req.user,
    loans: {
      totalLoanAmount,
      remainingBalance,
      paidPercent,
      activeCount: activeLoans.length,
    },
    nextEMI,
    training: {
      totalModules: progressStats?.total ?? 0,
      completedModules: progressStats?.completed ?? 0,
      inProgressModules: progressStats?.in_progress ?? 0,
    },
    cashflow: cashflow.reverse(),
    pendingDocuments: pendingDocs?.count ?? 0,
  });
}
