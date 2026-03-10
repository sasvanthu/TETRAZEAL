import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

// ---------------------------------------------------------------------------
// Rule-based AI Financial Advisor
// Analyses the user's real data and returns personalised advice.
// ---------------------------------------------------------------------------

interface AIResponse {
  reply: string;
  suggestions: string[];
  category?: string;
}

function buildContext(userId: number): Record<string, any> {
  const db = getDb();

  const loans = db.prepare(
    "SELECT * FROM loans WHERE user_id = ? AND status = 'active'"
  ).all(userId) as any[];

  const nextEMI = db.prepare(`
    SELECT er.*, l.title as loan_title FROM emi_records er
    JOIN loans l ON l.id = er.loan_id
    WHERE l.user_id = ? AND er.status = 'pending'
    ORDER BY er.due_date ASC LIMIT 1
  `).get(userId) as any;

  const cashflow = db.prepare(
    'SELECT * FROM cashflow_entries WHERE user_id = ? ORDER BY month DESC LIMIT 6'
  ).all(userId) as any[];

  const docsStatus = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM documents WHERE user_id = ? GROUP BY status
  `).all(userId) as any[];

  const progress = db.prepare(`
    SELECT SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as done,
           COUNT(*) as total
    FROM user_module_progress WHERE user_id = ?
  `).get(userId) as any;

  const schemes = db.prepare('SELECT * FROM gov_schemes ORDER BY match_score DESC LIMIT 3').all(userId) as any[];

  const user = db.prepare(
    'SELECT name, business_name, business_type, location, decision_score FROM users WHERE id = ?'
  ).get(userId) as any;

  // Computed metrics
  const totalEMI = loans.reduce((s: number, l: any) => s + l.emi_amount, 0);
  const avgInflow = cashflow.length
    ? cashflow.reduce((s: number, c: any) => s + c.inflow, 0) / cashflow.length
    : 0;
  const avgOutflow = cashflow.length
    ? cashflow.reduce((s: number, c: any) => s + c.outflow, 0) / cashflow.length
    : 0;
  const emiToCashflowRatio = avgInflow > 0 ? (totalEMI / avgInflow) * 100 : 0;

  return {
    user, loans, nextEMI, cashflow, docsStatus, progress, schemes,
    totalEMI, avgInflow, avgOutflow, emiToCashflowRatio,
  };
}

function classifyIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/emi|repay|instalment|instalment|payment/.test(lower)) return 'emi';
  if (/loan|borrow|credit|interest|bank/.test(lower)) return 'loan';
  if (/scheme|government|subsid|mudra|pmmy|yojana|grant/.test(lower)) return 'scheme';
  if (/document|aadhaar|pan|gst|kyc|upload/.test(lower)) return 'document';
  if (/score|credit score|rating|cibil/.test(lower)) return 'score';
  if (/budget|cashflow|cash flow|expense|income|saving/.test(lower)) return 'cashflow';
  if (/train|module|lesson|learn|course/.test(lower)) return 'training';
  if (/prepay|foreclose|early|payoff/.test(lower)) return 'prepayment';
  if (/compare|best bank|lowest rate|which bank/.test(lower)) return 'comparison';
  if (/tip|advice|suggest|help|what should/.test(lower)) return 'general';
  return 'general';
}

function advisorResponse(message: string, ctx: Record<string, any>): AIResponse {
  const intent = classifyIntent(message);
  const { user, loans, nextEMI, cashflow, docsStatus, progress, schemes,
    totalEMI, avgInflow, avgOutflow, emiToCashflowRatio } = ctx;

  switch (intent) {
    case 'emi': {
      if (!loans.length) {
        return {
          reply: `You currently have **no active loans**. When you take a loan, your EMI is calculated using:\n\n**EMI = P × R × (1+R)ᴺ / ((1+R)ᴺ - 1)**\n\nWhere P = Principal, R = Monthly rate, N = Tenure months.\n\nWould you like me to calculate an EMI for a hypothetical loan?`,
          suggestions: ['Calculate EMI for ₹5L at 10% for 3 years', 'How to reduce my EMI?', 'What is prepayment?'],
        };
      }
      const loan = loans[0];
      const remaining = loan.tenure_months - loan.paid_emis;
      return {
        reply: `Your current **${loan.title}** (${loan.bank_name}) has:\n\n- **Monthly EMI:** ₹${loan.emi_amount.toLocaleString('en-IN')}\n- **Tenure Remaining:** ${remaining} months\n- **Paid so far:** ${loan.paid_emis} EMIs\n\n${nextEMI ? `⚡ **Next due:** ₹${nextEMI.amount.toLocaleString('en-IN')} on ${nextEMI.due_date}` : 'All EMIs are up to date!'}\n\nYour EMI is **${emiToCashflowRatio.toFixed(0)}%** of your average monthly income — ${emiToCashflowRatio < 30 ? '✅ healthy ratio' : emiToCashflowRatio < 50 ? '⚠️ moderate — try to keep it under 30%' : '🔴 high — consider prepayment to reduce burden'}.`,
        suggestions: ['How much interest will I save by prepaying?', 'Can I change my EMI date?', 'Show my repayment schedule'],
        category: 'emi',
      };
    }

    case 'prepayment': {
      if (!loans.length) {
        return {
          reply: 'You have no active loans to prepay.',
          suggestions: ['How can I take a new loan?', 'What schemes am I eligible for?'],
        };
      }
      const loan = loans[0];
      const remaining = loan.tenure_months - loan.paid_emis;
      const totalInterestLeft = loan.emi_amount * remaining - (loan.principal - loan.emi_amount * loan.paid_emis);
      const prepayAmt = Math.round(avgInflow * 0.2);
      const monthsSaved = prepayAmt > 0 ? Math.round(totalInterestLeft / prepayAmt) : 0;
      return {
        reply: `💡 **Prepayment Analysis for ${loan.title}:**\n\n- Remaining interest cost: ₹${Math.abs(totalInterestLeft).toLocaleString('en-IN')}\n- Suggested prepayment: ₹${prepayAmt.toLocaleString('en-IN')} (20% of avg income)\n- Estimated months saved: ~${monthsSaved}\n\n**Benefits of prepayment:**\n- Reduces total interest burden\n- Improves your credit score\n- Frees up cash flow sooner\n\n⚠️ Check your loan agreement for prepayment penalties before proceeding.`,
        suggestions: ['How to make a prepayment?', 'Show loan comparison', 'What is my credit score?'],
        category: 'prepayment',
      };
    }

    case 'loan': {
      if (loans.length > 0) {
        const loan = loans[0];
        return {
          reply: `You have **${loans.length} active loan(s)**:\n\n- **${loan.title}** from ${loan.bank_name}\n  Principal: ₹${loan.principal.toLocaleString('en-IN')} @ ${loan.interest_rate}% p.a.\n  EMI: ₹${loan.emi_amount.toLocaleString('en-IN')} × ${loan.tenure_months} months\n\n${user.decision_score >= 75 ? `✅ Your decision score (${user.decision_score}/100) qualifies you for competitive rates. Consider refinancing if a better offer is available.` : `⚠️ Work on improving your decision score to get better loan terms next time.`}`,
          suggestions: ['Compare loan interest rates', 'How to refinance my loan?', 'What is my credit score?'],
          category: 'loan',
        };
      }
      return {
        reply: `You have no active loans. Here are the best options currently available:\n\n1. **SBI Business Loan** – 9.5% p.a., no collateral up to ₹25L\n2. **HDFC MSME Loan** – 10.2% p.a., quick disbursal\n3. **Mudra Yojana** – 8.5% p.a., specifically for micro enterprises\n\nBased on your business profile, you likely qualify for **Mudra Kishore (up to ₹5L)** with minimal documentation.`,
        suggestions: ['How to apply for Mudra Loan?', 'What documents are needed?', 'Calculate EMI for ₹3L'],
        category: 'loan',
      };
    }

    case 'scheme': {
      const topScheme = schemes[0];
      return {
        reply: `Based on your business profile as a **${user.business_type || 'micro-entrepreneur'}** in **${user.location || 'India'}**, here are your top matches:\n\n${schemes.slice(0, 3).map((s: any, i: number) => `${i + 1}. **${s.name}** — ${s.match_score}% match\n   Amount: ${s.loan_amount} | Rate: ${s.interest_rate}`).join('\n\n')}\n\n👆 **${topScheme?.name}** is your best match. Tap "Apply" on the Schemes page to begin.`,
        suggestions: ['How to apply for Mudra Loan?', 'What documents do I need?', 'Tell me about CGTMSE'],
        category: 'scheme',
      };
    }

    case 'document': {
      const verified = docsStatus.find((d: any) => d.status === 'verified')?.cnt ?? 0;
      const pending = docsStatus.find((d: any) => d.status === 'pending')?.cnt ?? 0;
      const rejected = docsStatus.find((d: any) => d.status === 'rejected')?.cnt ?? 0;
      const missing = docsStatus.find((d: any) => d.status === 'missing')?.cnt ?? 0;
      return {
        reply: `📁 **Your Document Status:**\n\n- ✅ Verified: ${verified}\n- ⏳ Pending review: ${pending}\n- ❌ Rejected (needs re-upload): ${rejected}\n- 🔴 Missing: ${missing}\n\n${rejected > 0 ? `**Action needed:** ${rejected} document(s) were rejected. Please re-upload with clearer scans.` : ''}\n${missing > 0 ? `**Missing docs:** Submit these to unlock better loan offers.` : ''}\n\nFor loan applications, you'll typically need: Aadhaar, PAN, GST Certificate, 6-month bank statement, and ITR acknowledgment.`,
        suggestions: ['Why was my document rejected?', 'What documents are needed for Mudra Loan?', 'Upload a document'],
        category: 'document',
      };
    }

    case 'score': {
      const score = user.decision_score;
      const level = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement';
      const tips = score < 80 ? [
        'Pay all EMIs on time (biggest factor)',
        'Keep your EMI-to-income ratio below 30%',
        'Complete all missing KYC documents',
        'Maintain 6+ months of steady income records',
        'Avoid multiple loan applications in a short period',
      ] : [
        'You\'re doing great! Maintain on-time payments.',
        'Consider a credit card for small purchases and pay in full monthly.',
        'Your income growth will further improve your score.',
      ];
      return {
        reply: `📊 **Your Financial Decision Score: ${score}/100 — ${level}**\n\n${tips.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n${score >= 75 ? `✅ You qualify for **premium loan offers** with rates as low as 8.5% p.a.` : `📈 Improving your score to 75+ will unlock significantly better loan rates.`}`,
        suggestions: ['How to improve my score faster?', 'What is a good EMI ratio?', 'Show best loan offers'],
        category: 'score',
      };
    }

    case 'cashflow': {
      if (!cashflow.length) {
        return {
          reply: 'I don\'t have enough cashflow data yet. Start by logging your monthly income and expenses on the Smart Tools page.',
          suggestions: ['Go to Smart Tools', 'How to track expenses?'],
        };
      }
      const latestMonth = cashflow[0];
      const net = latestMonth.inflow - latestMonth.outflow;
      const netPercent = latestMonth.inflow > 0 ? ((net / latestMonth.inflow) * 100).toFixed(0) : '0';
      const savingsRate = parseFloat(netPercent);
      return {
        reply: `💰 **Latest Cash Flow (${latestMonth.month}):**\n\n- Income: ₹${latestMonth.inflow.toLocaleString('en-IN')}\n- Expenses: ₹${latestMonth.outflow.toLocaleString('en-IN')}\n- **Net: ₹${net.toLocaleString('en-IN')} (${netPercent}% savings rate)**\n\n${savingsRate >= 20 ? '✅ Excellent! You\'re saving over 20% of your income.' : savingsRate >= 10 ? '📈 Good, but aim for 20%+ savings rate for financial security.' : '⚠️ Low savings rate. Review your expense breakdown and cut non-essentials.'}\n\nAverage monthly surplus over 6 months: ₹${Math.round(avgInflow - avgOutflow).toLocaleString('en-IN')}`,
        suggestions: ['How to reduce expenses?', 'Where should I invest my savings?', 'Should I prepay my loan?'],
        category: 'cashflow',
      };
    }

    case 'training': {
      const done = progress?.done ?? 0;
      const total = progress?.total ?? 0;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        reply: `🎓 **Your Training Progress: ${done}/${total} modules complete (${percent}%)**\n\n${percent < 50 ? '📚 You\'re just getting started! Complete the "Loan Fundamentals" and "Business Budgeting" modules first — they directly impact your financial decisions.\n\nEach completed module boosts your **Decision Score** by up to 5 points.' : percent < 100 ? '🌟 Great progress! You\'re over halfway there. The remaining modules cover advanced topics like Credit Score and Government Schemes.' : '🏆 Congratulations! You\'ve completed all training modules. Your financial literacy is in the top tier of our users!'}`,
        suggestions: ['Which module should I do next?', 'How does training help me?', 'Show training page'],
        category: 'training',
      };
    }

    case 'comparison': {
      return {
        reply: `🏦 **Current Best Loan Offers (April 2026):**\n\n1. **Mudra Yojana** — 8.5% p.a., No processing fee\n   Best for: Micro enterprises, first-time borrowers\n\n2. **State Bank of India** — 9.5% p.a., 1% processing fee\n   Best for: Established businesses with good credit\n\n3. **HDFC Bank** — 10.2% p.a., 1.5% processing fee\n   Best for: Quick disbursal, flexible tenure\n\n4. **ICICI Bank** — 11.0% p.a., 2% processing fee\n   Best for: Digital businesses, online repayment\n\n💡 **Tip:** On ₹5L over 3 years, Mudra Yojana vs ICICI saves **₹12,800** in total interest!`,
        suggestions: ['How to apply for Mudra Loan?', 'Calculate EMI comparison', 'What is my credit score?'],
        category: 'comparison',
      };
    }

    default: {
      // General / greeting / unknown
      if (/hello|hi|namaste|helo|hey/.test(message.toLowerCase())) {
        return {
          reply: `Namaste, **${user.name}**! 🙏\n\nI'm your FinZeal AI advisor. I can see your financial health at a glance:\n\n- 📊 Decision Score: **${user.decision_score}/100**\n- 🏦 Active Loans: **${loans.length}**\n- 💵 Avg Monthly Surplus: **₹${Math.round(avgInflow - avgOutflow).toLocaleString('en-IN')}**\n\nWhat would you like to explore today?`,
          suggestions: ['Analyze my loans', 'What schemes am I eligible for?', 'How is my cash flow?'],
        };
      }

      // Summary / what can you do
      if (/what can you|help me|features|capabilities/.test(message.toLowerCase())) {
        return {
          reply: `I'm your **FinZeal AI Financial Advisor**! Here's what I can do:\n\n- 📊 Analyze your loan health & EMI burden\n- 💡 Suggest prepayment & refinancing strategies\n- 🏛️ Match you with government schemes\n- 📁 Review your document readiness\n- 💰 Analyze your cash flow patterns\n- 🎓 Guide your financial training\n- 🏦 Compare loan offers across banks\n\nAsk me anything about your finances!`,
          suggestions: ['Analyze my finances', 'Best loan for me?', 'How to save more?'],
        };
      }

      return {
        reply: `Based on your current financial profile:\n\n**${user.name}** | ${user.business_name || 'Entrepreneur'} | Score: ${user.decision_score}/100\n\nHere's my quick assessment:\n${emiToCashflowRatio > 0 ? `- EMI-to-income ratio: ${emiToCashflowRatio.toFixed(0)}% ${emiToCashflowRatio < 30 ? '✅' : emiToCashflowRatio < 50 ? '⚠️' : '🔴'}` : ''}\n${avgInflow > avgOutflow ? `- Monthly surplus: ₹${Math.round(avgInflow - avgOutflow).toLocaleString('en-IN')} ✅` : '- Cash flow needs attention ⚠️'}\n- Decision score: ${user.decision_score}/100 ${user.decision_score >= 75 ? '✅' : '📈'}\n\nWhat specific aspect would you like to dive into?`,
        suggestions: ['Analyze my loans', 'What government schemes can I use?', 'How to improve my credit?', 'Compare bank offers'],
      };
    }
  }
}

export function chat(req: AuthenticatedRequest, res: Response): void {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    sendError(res, 'message is required'); return;
  }
  if (message.length > 1000) {
    sendError(res, 'Message too long'); return;
  }
  try {
    const ctx = buildContext(req.userId!);
    const response = advisorResponse(message.trim(), ctx);
    sendSuccess(res, response);
  } catch (err: any) {
    sendError(res, 'AI advisor unavailable: ' + err.message, 500);
  }
}

export function getFinancialSummary(req: AuthenticatedRequest, res: Response): void {
  try {
    const ctx = buildContext(req.userId!);
    const { user, loans, cashflow, docsStatus, progress, schemes, totalEMI, avgInflow, avgOutflow, emiToCashflowRatio } = ctx;

    const insights: Array<{ type: string; text: string; color: string }> = [];

    if (emiToCashflowRatio > 50) {
      insights.push({ type: 'warning', text: `EMI burden is ${emiToCashflowRatio.toFixed(0)}% of income — consider prepayment.`, color: 'rose' });
    } else if (emiToCashflowRatio > 30) {
      insights.push({ type: 'caution', text: `EMI-to-income ratio is ${emiToCashflowRatio.toFixed(0)}% — moderate but manageable.`, color: 'amber' });
    } else if (loans.length > 0) {
      insights.push({ type: 'good', text: `EMI burden is healthy at ${emiToCashflowRatio.toFixed(0)}% of income.`, color: 'emerald' });
    }

    if (cashflow.length >= 3) {
      const recent3 = cashflow.slice(0, 3);
      const allPositive = recent3.every((c: any) => c.inflow > c.outflow);
      if (!allPositive) insights.push({ type: 'warning', text: 'Negative cash flow detected in recent months.', color: 'rose' });
    }

    const rejected = docsStatus.find((d: any) => d.status === 'rejected')?.cnt ?? 0;
    const missing = docsStatus.find((d: any) => d.status === 'missing')?.cnt ?? 0;
    if (rejected > 0) insights.push({ type: 'action', text: `${rejected} document(s) rejected — re-upload to improve eligibility.`, color: 'amber' });
    if (missing > 0) insights.push({ type: 'action', text: `${missing} document(s) missing — required for loan applications.`, color: 'indigo' });

    const done = progress?.done ?? 0;
    const total = progress?.total ?? 0;
    if (total > 0 && done < total) {
      insights.push({ type: 'info', text: `Complete ${total - done} more training module(s) to boost your score.`, color: 'indigo' });
    }

    sendSuccess(res, {
      score: user.decision_score,
      totalEMI,
      avgInflow,
      avgOutflow,
      netSurplus: avgInflow - avgOutflow,
      emiToCashflowRatio,
      insights,
      topScheme: schemes[0] ?? null,
      trainingProgress: { done, total },
    });
  } catch (err: any) {
    sendError(res, err.message, 500);
  }
}
