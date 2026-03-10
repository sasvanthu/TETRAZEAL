import React from "react";

export const Analytics = () => {
  return (
    <div className="text-white p-10">

      {/* TITLE */}

      <h1 className="text-3xl font-bold mb-10">
        Financial Analytics
      </h1>

      {/* OVERVIEW CARDS */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Monthly Income</p>
          <h2 className="text-2xl font-bold text-emerald-400 mt-2">
            ₹45,000
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Monthly Expenses</p>
          <h2 className="text-2xl font-bold mt-2">
            ₹28,000
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Savings</p>
          <h2 className="text-2xl font-bold text-emerald-400 mt-2">
            ₹17,000
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Active Loans</p>
          <h2 className="text-2xl font-bold mt-2">
            2
          </h2>
        </div>

      </div>

      {/* FINANCIAL PERFORMANCE */}

      <div className="grid grid-cols-2 gap-8">

        {/* Income vs Expense */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-4">
            Income vs Expenses
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-slate-400">Income</p>

              <div className="w-full bg-slate-700 h-3 rounded-full mt-1">
                <div className="bg-emerald-500 h-3 rounded-full w-[75%]"></div>
              </div>

            </div>

            <div>
              <p className="text-sm text-slate-400">Expenses</p>

              <div className="w-full bg-slate-700 h-3 rounded-full mt-1">
                <div className="bg-red-500 h-3 rounded-full w-[45%]"></div>
              </div>

            </div>

          </div>

        </div>

        {/* Loan Analytics */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-4">
            Loan Analytics
          </h2>

          <div className="space-y-4 text-slate-300">

            <p>
              Total Loan Amount:
              <span className="text-emerald-400 ml-2">
                ₹2,50,000
              </span>
            </p>

            <p>
              Total EMI Paid:
              <span className="text-emerald-400 ml-2">
                ₹45,000
              </span>
            </p>

            <p>
              Remaining Balance:
              <span className="text-emerald-400 ml-2">
                ₹2,05,000
              </span>
            </p>

            <p>
              Next EMI Date:
              <span className="text-emerald-400 ml-2">
                25 March 2026
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* SAVINGS INSIGHTS */}

      <div className="bg-slate-800 p-6 rounded-xl mt-10">

        <h2 className="text-xl font-semibold mb-4">
          Savings Insight
        </h2>

        <p className="text-slate-300">
          Based on your monthly income and expenses, you are saving
          approximately
          <span className="text-emerald-400 font-semibold">
            {" "}₹17,000 per month.
          </span>
          This is a healthy saving rate. Consider investing a portion of your
          savings into long-term assets to grow your wealth.
        </p>

      </div>

    </div>
  );
};