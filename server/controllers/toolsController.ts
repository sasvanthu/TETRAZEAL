import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { calculateEMI } from '../utils/emi.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getCashflow(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const { months } = req.query;
  const limit = Math.min(Number(months) || 7, 24);
  const entries = db.prepare(
    'SELECT month, inflow, outflow FROM cashflow_entries WHERE user_id = ? ORDER BY month DESC LIMIT ?'
  ).all(req.userId!, limit);
  sendSuccess(res, entries.reverse());
}

export function upsertCashflow(req: AuthenticatedRequest, res: Response): void {
  const { month, inflow, outflow } = req.body;
  if (!month || inflow === undefined || outflow === undefined) {
    sendError(res, 'month, inflow, and outflow are required'); return;
  }
  const db = getDb();
  db.prepare(`
    INSERT INTO cashflow_entries (user_id, month, inflow, outflow)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, month) DO UPDATE SET inflow = excluded.inflow, outflow = excluded.outflow
  `).run(req.userId!, month, inflow, outflow);
  sendSuccess(res, db.prepare('SELECT * FROM cashflow_entries WHERE user_id = ? AND month = ?').get(req.userId!, month));
}

export function getFinancialInsights(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const userId = req.userId!;

  const cashflow = db.prepare(
    'SELECT month, inflow, outflow FROM cashflow_entries WHERE user_id = ? ORDER BY month DESC LIMIT 3'
  ).all(userId) as any[];

  const activeLoans = db.prepare(
    'SELECT principal, interest_rate, tenure_months, paid_emis, emi_amount FROM loans WHERE user_id = ? AND status = ?'
  ).all(userId, 'active') as any[];

  const insights: string[] = [];
  let advisorTip = '';

  if (cashflow.length > 0) {
    const avgNetCashflow = cashflow.reduce((s, c) => s + (c.inflow - c.outflow), 0) / cashflow.length;
    if (avgNetCashflow > 10000) {
      insights.push(`Average monthly surplus of ₹${Math.round(avgNetCashflow).toLocaleString('en-IN')} detected.`);
    } else if (avgNetCashflow < 0) {
      insights.push('⚠️ Your recent cash outflows exceed inflows. Review your expenses.');
    }
    if (activeLoans.length > 0) {
      const totalEMI = activeLoans.reduce((s, l) => s + l.emi_amount, 0);
      if (avgNetCashflow > totalEMI * 1.5) {
        const prepayAmount = Math.round(avgNetCashflow * 0.3);
        advisorTip = `Based on your recent cash flow, you can prepay ₹${prepayAmount.toLocaleString('en-IN')} this month to reduce total interest burden.`;
      }
    }
  }

  if (activeLoans.length > 1) {
    insights.push('You have multiple active loans. Consider consolidation to reduce total interest.');
  }

  sendSuccess(res, { insights, advisorTip: advisorTip || 'Keep tracking your monthly cash flow to get personalized tips.' });
}

export function getLoanComparison(_req: AuthenticatedRequest, res: Response): void {
  const offers = [
    { name: 'State Bank of India', rate: 9.5, fee: '1%', eligibility: 'High', color: 'emerald' },
    { name: 'HDFC Bank', rate: 10.2, fee: '1.5%', eligibility: 'Medium', color: 'amber' },
    { name: 'Mudra Yojana', rate: 8.5, fee: 'Nil', eligibility: 'High', color: 'indigo' },
    { name: 'ICICI Bank', rate: 11.0, fee: '2%', eligibility: 'Medium', color: 'amber' },
  ];
  sendSuccess(res, offers);
}
