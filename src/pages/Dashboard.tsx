import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { AnimatedProgress } from "../components/ui/AnimatedProgress";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  BookOpen,
  Wallet,
  FileText,
  Sparkles,
  RefreshCw
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { api } from "../lib/api";

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 22 }
    }
  }
};

const FALLBACK = {
  loans: { totalLoanAmount: 500000, remainingBalance: 345000, paidPercent: 31 },
  nextEMI: { amount: 12500, due_date: "2026-10-15" },
  training: { completedModules: 2, totalModules: 4 },
  pendingDocuments: 1,
  cashflow: [
    { month: "Jan", inflow: 40000, outflow: 24000 },
    { month: "Feb", inflow: 38000, outflow: 22000 },
    { month: "Mar", inflow: 45000, outflow: 27000 },
    { month: "Apr", inflow: 42000, outflow: 30000 },
    { month: "May", inflow: 50000, outflow: 25000 },
    { month: "Jun", inflow: 55000, outflow: 28000 }
  ]
};

export const Dashboard = () => {

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const [data, setData] = useState<any>(FALLBACK);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {

    setLoading(true);

    Promise.all([
      api.getDashboard().catch(() => null),
      api.getInsights().catch(() => null)
    ])
      .then(([dash, ins]) => {
        if (dash) setData(dash);
        if (ins?.advisorTip) setTip(ins.advisorTip);
      })
      .finally(() => setLoading(false));

  };

  useEffect(() => {
    load();
  }, []);

  const loans = data?.loans || FALLBACK.loans;
  const nextEMI = data?.nextEMI || FALLBACK.nextEMI;
  const training = data?.training || FALLBACK.training;
  const cashflow = data?.cashflow || FALLBACK.cashflow;

  const chartData = cashflow.map((c: any) => ({
    name: c.month,
    inflow: c.inflow,
    outflow: c.outflow
  }));

  const trainingPct =
    training.totalModules > 0
      ? Math.round((training.completedModules / training.totalModules) * 100)
      : 60;

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}

      <motion.div
        variants={stagger.item}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {loggedUser?.name || "User"} 👋
          </h1>

          <p className="text-slate-400 mt-1">
            Here's your financial overview for today.
          </p>
        </div>

        <button
          onClick={load}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </motion.div>

      {/* Cards */}

      <motion.div
        variants={stagger.item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >

        <GlassCard>
          <h3 className="text-sm text-slate-400">Total Loan Amount</h3>

          <p className="text-2xl font-bold text-white mt-3">
            ₹{loans.totalLoanAmount.toLocaleString("en-IN")}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm text-slate-400">Remaining Balance</h3>

          <p className="text-2xl font-bold text-white mt-3">
            ₹{loans.remainingBalance.toLocaleString("en-IN")}
          </p>

          <AnimatedProgress value={loans.paidPercent} />
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm text-slate-400">Next EMI</h3>

          <p className="text-2xl font-bold text-white mt-3">
            ₹{nextEMI.amount.toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-rose-400 mt-1">
            Due {nextEMI.due_date}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm text-slate-400">Training Progress</h3>

          <p className="text-2xl font-bold text-white mt-3">
            {training.completedModules}/{training.totalModules}
          </p>

          <AnimatedProgress value={trainingPct} />
        </GlassCard>

      </motion.div>

      {/* Chart */}

      <motion.div variants={stagger.item}>

        <GlassCard>

          <h2 className="text-lg font-semibold text-white mb-4">
            Cash Flow Analytics
          </h2>

          <div className="h-[260px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="inflow"
                  stroke="#10b981"
                  fill="#10b98133"
                />

                <Area
                  type="monotone"
                  dataKey="outflow"
                  stroke="#f43f5e"
                  fill="#f43f5e33"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </GlassCard>

      </motion.div>

      {/* AI Advisor */}

      <GlassCard className="bg-emerald-900/30 border-emerald-500/20">

        <div className="flex items-center gap-2 mb-3">

          <Sparkles className="text-emerald-400 h-4 w-4" />

          <h2 className="text-sm font-semibold text-emerald-300">
            AI Advisor
          </h2>

        </div>

        <p className="text-sm text-emerald-100/80">

          {tip ||
            "Based on your finances, consider prepaying part of your loan this month to reduce interest."}

        </p>

      </GlassCard>

    </motion.div>
  );
};