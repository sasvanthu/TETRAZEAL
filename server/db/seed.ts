import bcrypt from 'bcryptjs';
import { getDb } from './database.js';
import { calculateEMI } from '../utils/emi.js';

export function seedDatabase(): void {
  const db = getDb();

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('john@example.com');
  if (existingUser) return; // Already seeded

  // --- Users ---
  const passwordHash = bcrypt.hashSync('password123', 10);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, business_name, business_type, location, avatar_initials, decision_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const userId = (insertUser.run('John Sharma', 'john@example.com', passwordHash, '9876543210', 'Sharma General Store', 'Retail', 'Jaipur, Rajasthan', 'JS', 85) as any).lastInsertRowid as number;

  // --- Loans ---
  const principal = 500000;
  const rate = 10.5;
  const tenure = 48;
  const emi = calculateEMI(principal, rate, tenure);

  const insertLoan = db.prepare(`
    INSERT INTO loans (user_id, title, bank_name, principal, interest_rate, tenure_months, start_date, status, emi_amount, paid_emis)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertLoan.run(userId, 'Business Expansion Loan', 'State Bank of India', principal, rate, tenure, '2025-04-01', 'active', emi, 11);

  const insertLoan2 = db.prepare(`
    INSERT INTO loans (user_id, title, bank_name, principal, interest_rate, tenure_months, start_date, status, emi_amount, paid_emis)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const loanId2 = (insertLoan2.run(userId, 'Equipment Purchase Loan', 'HDFC Bank', 150000, 12.5, 24, '2024-10-01', 'closed', calculateEMI(150000, 12.5, 24), 24) as any).lastInsertRowid as number;

  // --- EMI Records (next 3 upcoming for the active loan) ---
  const insertEMI = db.prepare(`
    INSERT INTO emi_records (loan_id, due_date, amount, status, paid_date) VALUES (?, ?, ?, ?, ?)
  `);
  const loanId1 = db.prepare('SELECT id FROM loans WHERE title = ?').get('Business Expansion Loan') as any;
  insertEMI.run(loanId1.id, '2026-03-15', emi, 'pending', null);
  insertEMI.run(loanId1.id, '2026-04-15', emi, 'pending', null);
  insertEMI.run(loanId1.id, '2026-02-15', emi, 'paid', '2026-02-12');

  // --- Documents ---
  const insertDoc = db.prepare(`
    INSERT INTO documents (user_id, name, type, file_name, file_size_kb, status, rejection_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertDoc.run(userId, 'Aadhaar Card', 'Identity Proof', 'aadhaar.pdf', 2400, 'verified', null);
  insertDoc.run(userId, 'PAN Card', 'Identity Proof', 'pan_card.pdf', 1800, 'verified', null);
  insertDoc.run(userId, 'GST Registration', 'Business Proof', 'gst_cert.pdf', 4100, 'pending', null);
  insertDoc.run(userId, 'Bank Statement (6M)', 'Income Proof', 'bank_stmt.pdf', 8500, 'rejected', 'Blurry image on page 3');
  insertDoc.run(userId, 'ITR Acknowledgment', 'Income Proof', null, 0, 'missing', null);

  // --- Government Schemes ---
  const insertScheme = db.prepare(`
    INSERT INTO gov_schemes (name, category, ministry, description, loan_amount, interest_rate, eligibility, tags, deadline, match_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertScheme.run(
    'Pradhan Mantri Mudra Yojana (PMMY)', 'Micro Finance', 'Ministry of Finance',
    'Provides loans up to ₹10 lakhs to non-corporate, non-farm small/micro enterprises.',
    'Up to ₹10 Lakhs', '8.5% - 12%',
    JSON.stringify(['Micro Enterprises', 'Non-Corporate', 'Non-Farm']),
    JSON.stringify(['Mudra', 'Micro Finance', 'Small Business']), null, 95
  );
  insertScheme.run(
    'Stand-Up India Scheme', 'SC/ST/Women Entrepreneurs', 'SIDBI',
    'Facilitates bank loans between ₹10 lakh and ₹1 crore to SC/ST and women borrowers.',
    '₹10 Lakhs - ₹1 Crore', 'Base Rate + 3%',
    JSON.stringify(['SC/ST Category', 'Women Entrepreneurs', 'Greenfield Enterprise']),
    JSON.stringify(['Women', 'SC/ST', 'Startup']), null, 80
  );
  insertScheme.run(
    'Credit Guarantee Fund Trust (CGTMSE)', 'Collateral Free', 'Ministry of MSME',
    'Provides collateral-free credit to micro and small enterprises.',
    'Up to ₹2 Crores', 'Varies by Bank',
    JSON.stringify(['New MSMEs', 'Existing MSMEs', 'Manufacturing/Services']),
    JSON.stringify(['Collateral Free', 'MSME', 'Credit Guarantee']), null, 90
  );
  insertScheme.run(
    'PM SVANidhi Scheme', 'Street Vendors', 'Ministry of Housing',
    'Working capital loan for street vendors to resume their livelihoods.',
    'Up to ₹50,000', '7%',
    JSON.stringify(['Street Vendors', 'Urban Areas', 'Below ₹50,000 requirement']),
    JSON.stringify(['Street Vendor', 'Working Capital', 'Urban']), null, 60
  );

  // --- Training Modules ---
  const insertModule = db.prepare(`
    INSERT INTO training_modules (title, description, duration_mins, rating, category, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const m1 = (insertModule.run('Loan Fundamentals', 'Understand interest rates, EMIs, and loan terms.', 45, 4.8, 'Finance Basics', 1) as any).lastInsertRowid as number;
  const m2 = (insertModule.run('Business Budgeting', 'Learn how to manage cash flow and track expenses.', 60, 4.9, 'Finance Basics', 2) as any).lastInsertRowid as number;
  const m3 = (insertModule.run('Credit Score Secrets', 'How to build and maintain a healthy credit score.', 30, 4.7, 'Credit', 3) as any).lastInsertRowid as number;
  const m4 = (insertModule.run('Government Schemes', 'Explore subsidies and grants for rural businesses.', 40, 4.9, 'Schemes', 4) as any).lastInsertRowid as number;
  const m5 = (insertModule.run('Digital Payments', 'Accept digital payments and grow your customer base.', 35, 4.6, 'Digital', 5) as any).lastInsertRowid as number;

  // --- User Module Progress ---
  const insertProgress = db.prepare(`
    INSERT INTO user_module_progress (user_id, module_id, progress, status, started_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertProgress.run(userId, m1, 100, 'completed', '2025-11-01', '2025-11-05');
  insertProgress.run(userId, m2, 40, 'in-progress', '2025-12-01', null);
  insertProgress.run(userId, m3, 0, 'not-started', null, null);
  insertProgress.run(userId, m4, 0, 'not-started', null, null);
  insertProgress.run(userId, m5, 0, 'not-started', null, null);

  // --- Cashflow Entries ---
  const insertCashflow = db.prepare(`
    INSERT INTO cashflow_entries (user_id, month, inflow, outflow) VALUES (?, ?, ?, ?)
  `);
  const cashflowData = [
    ['2025-09', 40000, 24000],
    ['2025-10', 30000, 13980],
    ['2025-11', 20000, 9800],
    ['2025-12', 27800, 39080],
    ['2026-01', 18900, 4800],
    ['2026-02', 23900, 3800],
    ['2026-03', 34900, 4300],
  ];
  for (const [month, inflow, outflow] of cashflowData) {
    insertCashflow.run(userId, month, inflow, outflow);
  }

  // --- Community Posts ---
  const insertPost = db.prepare(`
    INSERT INTO community_posts (user_id, author_name, author_role, author_initials, title, content, category, tags, likes, reply_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPost.run(userId, 'Sunita M.', 'Retail Shop Owner', 'SM', 'How to manage inventory during festive season?',
    'I usually face a cash crunch right before Diwali when I need to stock up. Any tips on managing working capital better?',
    'Working Capital', JSON.stringify(['Inventory', 'Working Capital']), 24, 8);
  insertPost.run(userId, 'Abdul R.', 'Handicraft Manufacturer', 'AR', 'Experience with Mudra Loan application',
    'Just got my Mudra loan approved! The process was much smoother than I expected. Happy to answer any questions about the documentation needed.',
    'Loans', JSON.stringify(['Mudra Loan', 'Success Story']), 45, 12);
  insertPost.run(userId, 'Priya K.', 'Tailoring Business', 'PK', 'Best accounting app for small business?',
    'I am currently tracking everything in a notebook but want to move to digital. What are some simple apps that work well on mobile?',
    'Tools', JSON.stringify(['Tools', 'Accounting']), 15, 22);

  console.log('✅ Database seeded successfully');
}
