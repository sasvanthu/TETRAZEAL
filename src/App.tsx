import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { LoanManagement } from './pages/LoanManagement';
import { FinancialLiteracy } from './pages/FinancialLiteracy';
import { SmartTools } from './pages/SmartTools';
import { GovSchemes } from './pages/GovSchemes';
import { Documents } from './pages/Documents';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { AIAdvisor } from './pages/AIAdvisor';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loans" element={<LoanManagement />} />
            <Route path="/training" element={<FinancialLiteracy />} />
            <Route path="/tools" element={<SmartTools />} />
            <Route path="/schemes" element={<GovSchemes />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
