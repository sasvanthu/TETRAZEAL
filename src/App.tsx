import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

const PrivateRoute = ({ children }: any) => {

  const user = localStorage.getItem("loggedUser");

  return user ? children : <Navigate to="/login" />;

};

export default function App() {

  return (

    <Router>

      <Routes>

        {/* PUBLIC */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED DASHBOARD */}

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />

          <Route
            path="/loans"
            element={<PrivateRoute><LoanManagement /></PrivateRoute>}
          />

          <Route
            path="/training"
            element={<PrivateRoute><FinancialLiteracy /></PrivateRoute>}
          />

          <Route
            path="/tools"
            element={<PrivateRoute><SmartTools /></PrivateRoute>}
          />

          <Route
            path="/emi-calculator"
            element={<PrivateRoute><EMICalculator /></PrivateRoute>}
          />

<<<<<<< HEAD
            <Route path="/documents" element={<Documents />} />
=======
          <Route
            path="/financial-score"
            element={<PrivateRoute><FinancialScore /></PrivateRoute>}
          />

          <Route
            path="/analytics"
            element={<PrivateRoute><Analytics /></PrivateRoute>}
          />
>>>>>>> akila

          <Route
            path="/notifications"
            element={<PrivateRoute><Notifications /></PrivateRoute>}
          />

          <Route
            path="/schemes"
            element={<PrivateRoute><GovSchemes /></PrivateRoute>}
          />

          <Route
            path="/documents"
            element={<PrivateRoute><Documents /></PrivateRoute>}
          />

          <Route
            path="/community"
            element={<PrivateRoute><Community /></PrivateRoute>}
          />

          <Route
            path="/ai-advisor"
            element={<PrivateRoute><AIAdvisor /></PrivateRoute>}
          />

          <Route
            path="/settings"
            element={<PrivateRoute><Settings /></PrivateRoute>}
          />

        </Route>

      </Routes>

    </Router>

  );
}