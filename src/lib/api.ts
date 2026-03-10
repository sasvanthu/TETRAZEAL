const BASE = 'http://localhost:4000/api';

function getToken(): string | null {
  return localStorage.getItem('finzeal_token');
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json.data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    req<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: object) =>
    req<{ token: string; userId: number }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => req<any>('/auth/me'),

  // Dashboard
  getDashboard: () => req<any>('/dashboard'),

  // Loans
  getLoans: () => req<any[]>('/loans'),
  getLoan: (id: number) => req<any>(`/loans/${id}`),
  createLoan: (data: object) => req<any>('/loans', { method: 'POST', body: JSON.stringify(data) }),
  updateLoan: (id: number, data: object) => req<any>(`/loans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLoan: (id: number) => req<any>(`/loans/${id}`, { method: 'DELETE' }),
  markEMIPaid: (emiId: number) => req<any>(`/loans/emi/${emiId}/pay`, { method: 'PATCH' }),
  calculateEMI: (principal: number, interest_rate: number, tenure_months: number) =>
    req<any>(`/loans/calculate?principal=${principal}&interest_rate=${interest_rate}&tenure_months=${tenure_months}`),

  // Documents
  getDocuments: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return req<any[]>(`/documents${q ? '?' + q : ''}`);
  },
  uploadDocument: (data: object) => req<any>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  deleteDocument: (id: number) => req<any>(`/documents/${id}`, { method: 'DELETE' }),
  updateDocStatus: (id: number, status: string, reason?: string) =>
    req<any>(`/documents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejection_reason: reason }) }),

  // Schemes
  getSchemes: (params?: { search?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return req<any[]>(`/schemes${q ? '?' + q : ''}`);
  },
  getSchemeCategories: () => req<string[]>('/schemes/categories'),

  // Community
  getPosts: (params?: { search?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return req<any[]>(`/community${q ? '?' + q : ''}`);
  },
  getPost: (id: number) => req<any>(`/community/${id}`),
  createPost: (data: object) => req<any>('/community', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id: number) => req<any>(`/community/${id}/like`, { method: 'POST' }),
  addReply: (id: number, content: string) =>
    req<any>(`/community/${id}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),
  deletePost: (id: number) => req<any>(`/community/${id}`, { method: 'DELETE' }),

  // Training
  getModules: () => req<any[]>('/training'),
  getTrainingSummary: () => req<any>('/training/summary'),
  updateProgress: (id: number, progress: number) =>
    req<any>(`/training/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ progress }) }),

  // Tools
  getCashflow: (months?: number) => req<any[]>(`/tools/cashflow${months ? '?months=' + months : ''}`),
  upsertCashflow: (data: object) => req<any>('/tools/cashflow', { method: 'POST', body: JSON.stringify(data) }),
  getInsights: () => req<any>('/tools/insights'),
  getLoanComparison: () => req<any[]>('/tools/loan-comparison'),

  // Settings
  getProfile: () => req<any>('/settings/profile'),
  updateProfile: (data: object) => req<any>('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (current_password: string, new_password: string) =>
    req<any>('/settings/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),

  // AI Chat
  chat: (message: string, context?: string) =>
    req<{ reply: string; suggestions: string[] }>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
  getAISummary: () => req<any>('/ai/summary'),
};
