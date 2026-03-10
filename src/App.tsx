import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Layout } from './components/layout/Layout';

import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { LoanManagement } from './pages/LoanManagement';
import { FinancialLiteracy } from './pages/FinancialLiteracy';
import { SmartTools } from './pages/SmartTools';
import { Documents } from './pages/Documents';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { AIAdvisor } from './pages/AIAdvisor';

import { EMICalculator } from './pages/EMICalculator';
import { FinancialScore } from './pages/FinancialScore';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';

import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>

          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Main Layout */}
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/loans" element={<LoanManagement />} />

            <Route path="/training" element={<FinancialLiteracy />} />

            <Route path="/tools" element={<SmartTools />} />

            {/* NEW PAGES */}

            <Route path="/emi-calculator" element={<EMICalculator />} />

            <Route path="/financial-score" element={<FinancialScore />} />

            <Route path="/analytics" element={<Analytics />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/documents" element={<Documents />} />

            <Route path="/community" element={<Community />} />

            <Route path="/ai-advisor" element={<AIAdvisor />} />

            <Route path="/settings" element={<Settings />} />

          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
}