/**
 * Calculates the monthly EMI using the standard formula:
 * EMI = P * R * (1+R)^N / ((1+R)^N - 1)
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (annualRate === 0) return Math.round(principal / tenureMonths);
  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

export function calculateTotalInterest(emi: number, tenureMonths: number, principal: number): number {
  return emi * tenureMonths - principal;
}

export function generateEMISchedule(
  loanId: number,
  emi: number,
  tenureMonths: number,
  startDate: string
): Array<{ loan_id: number; due_date: string; amount: number; status: 'paid' | 'pending' | 'overdue' }> {
  const schedule = [];
  const start = new Date(startDate);
  const now = new Date();

  for (let i = 1; i <= tenureMonths; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    let status: 'paid' | 'pending' | 'overdue' = 'pending';
    if (dueDate < now) status = 'overdue';

    schedule.push({ loan_id: loanId, due_date: dueDateStr, amount: emi, status });
  }
  return schedule;
}
