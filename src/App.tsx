import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout/Layout";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { Dashboard } from "./pages/Dashboard";
import { LoanManagement } from "./pages/LoanManagement";
import { FinancialLiteracy } from "./pages/FinancialLiteracy";
import { SmartTools } from "./pages/SmartTools";
import { EMICalculator } from "./pages/EMICalculator";
import { FinancialScore } from "./pages/FinancialScore";
import { Analytics } from "./pages/Analytics";
import { Notifications } from "./pages/Notifications";
import { GovSchemes } from "./pages/GovSchemes";
import { Documents } from "./pages/Documents";
import { Community } from "./pages/Community";
import { AIAdvisor } from "./pages/AIAdvisor";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <Router>

      <Routes>

        {/* PUBLIC PAGES */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD LAYOUT */}

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loans" element={<LoanManagement />} />
          <Route path="/training" element={<FinancialLiteracy />} />
          <Route path="/tools" element={<SmartTools />} />

          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/financial-score" element={<FinancialScore />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/schemes" element={<GovSchemes />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/community" element={<Community />} />

          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>

    </Router>
  );
}