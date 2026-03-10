import React from "react";

export const FinancialScore = () => {

  const score = 78;

  return (
    <div className="text-white p-10">

      {/* TITLE */}

      <h1 className="text-3xl font-bold mb-10">
        Financial Health Score
      </h1>


      {/* TOP SECTION */}

      <div className="grid grid-cols-3 gap-8 mb-10">

        {/* SCORE CARD */}

        <div className="bg-slate-800 p-6 rounded-xl text-center">

          <p className="text-slate-400 mb-3">Your Score</p>

          <div className="text-5xl font-bold text-emerald-400">
            {score} / 100
          </div>

          <p className="text-slate-400 mt-4">
            Good financial stability. Keep managing loans and expenses properly.
          </p>

        </div>


        {/* SCORE BREAKDOWN */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Score Breakdown
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-slate-400">Savings Ratio</p>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-1">
                <div className="bg-emerald-500 h-2 rounded-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Loan Repayment</p>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-1">
                <div className="bg-blue-500 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Expense Control</p>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-1">
                <div className="bg-yellow-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>

          </div>

        </div>


        {/* RISK STATUS */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Risk Assessment
          </h2>

          <div className="space-y-3 text-slate-300">

            <p>
              Debt Risk:
              <span className="text-emerald-400 ml-2">
                Low
              </span>
            </p>

            <p>
              EMI Pressure:
              <span className="text-yellow-400 ml-2">
                Moderate
              </span>
            </p>

            <p>
              Financial Stability:
              <span className="text-emerald-400 ml-2">
                Strong
              </span>
            </p>

          </div>

        </div>

      </div>


      {/* AI RECOMMENDATIONS */}

      <div className="bg-slate-800 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Smart Suggestions
        </h2>

        <ul className="space-y-2 text-slate-300">

          <li>• Reduce unnecessary monthly expenses</li>
          <li>• Maintain at least 6 months emergency savings</li>
          <li>• Pay EMIs before due date to improve score</li>
          <li>• Consider investing excess savings for business growth</li>

        </ul>

      </div>


      {/* FINANCIAL IMPROVEMENT TIPS */}

      <div className="bg-slate-800 p-6 rounded-xl">

        <h2 className="text-xl font-semibold mb-4">
          Financial Improvement Tips
        </h2>

        <p className="text-slate-300">

          Your financial health score is calculated based on income stability,
          savings rate, loan repayment history, and expense management.

          Maintaining consistent savings and reducing unnecessary spending can
          help improve your score above
          <span className="text-emerald-400 font-semibold">
            {" "}85+
          </span>
          which indicates excellent financial health.

        </p>

      </div>

    </div>
  );
};