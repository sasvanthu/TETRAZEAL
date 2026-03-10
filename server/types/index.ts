import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  business_name?: string;
  business_type?: string;
  location?: string;
  avatar_initials?: string;
  decision_score: number;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: number;
  user_id: number;
  title: string;
  bank_name: string;
  principal: number;
  interest_rate: number;
  tenure_months: number;
  start_date: string;
  status: 'active' | 'closed' | 'pending';
  emi_amount: number;
  paid_emis: number;
  created_at: string;
}

export interface EMIRecord {
  id: number;
  loan_id: number;
  due_date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paid_date?: string;
}

export interface Document {
  id: number;
  user_id: number;
  name: string;
  type: string;
  file_name: string;
  file_size_kb: number;
  status: 'verified' | 'pending' | 'rejected' | 'missing';
  rejection_reason?: string;
  uploaded_at: string;
}

export interface GovScheme {
  id: number;
  name: string;
  category: string;
  ministry: string;
  description: string;
  loan_amount: string;
  interest_rate: string;
  eligibility: string; // JSON array string
  tags: string;        // JSON array string
  deadline?: string;
  match_score: number;
}

export interface CommunityPost {
  id: number;
  user_id: number;
  author_name: string;
  author_role: string;
  author_initials: string;
  title: string;
  content: string;
  category: string;
  tags: string; // JSON array string
  likes: number;
  reply_count: number;
  created_at: string;
}

export interface CommunityReply {
  id: number;
  post_id: number;
  user_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  description: string;
  duration_mins: number;
  rating: number;
  category: string;
  order_index: number;
}

export interface UserModuleProgress {
  id: number;
  user_id: number;
  module_id: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  started_at?: string;
  completed_at?: string;
}

export interface CashflowEntry {
  id: number;
  user_id: number;
  month: string;
  inflow: number;
  outflow: number;
}

export interface AuthenticatedRequest extends Request {
  userId?: number;
  user?: Omit<User, 'password_hash'>;
}
