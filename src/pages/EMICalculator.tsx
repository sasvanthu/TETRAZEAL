import React, { useState } from "react";

export const EMICalculator = () => {

  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(12);

  const monthlyRate = rate / 12 / 100;

  const emi =
    amount && tenure
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1)
      : 0;

  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;

  return (
    <div className="text-white p-10">

      {/* TITLE */}

      <h1 className="text-3xl font-bold mb-8">EMI Calculator</h1>

      {/* CALCULATOR SECTION */}

      <div className="grid grid-cols-2 gap-10">

        {/* INPUT */}

        <div className="bg-slate-800 p-6 rounded-xl space-y-6">

          <div>
            <label className="block mb-2">Loan Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 rounded bg-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full p-3 rounded bg-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2">Tenure (Months)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full p-3 rounded bg-slate-700"
            />
          </div>

        </div>

        {/* RESULT */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-6">Loan Summary</h2>

          <div className="mb-4">
            <p className="text-slate-300">Monthly EMI</p>
            <p className="text-3xl font-bold text-emerald-400">
              ₹ {emi ? emi.toFixed(0) : 0}
            </p>
          </div>

          <div className="mb-3">
            <p className="text-slate-300">Total Interest</p>
            <p className="text-lg">
              ₹ {totalInterest ? totalInterest.toFixed(0) : 0}
            </p>
          </div>

          <div>
            <p className="text-slate-300">Total Payment</p>
            <p className="text-lg">
              ₹ {totalPayment ? totalPayment.toFixed(0) : 0}
            </p>
          </div>

        </div>

      </div>

      {/* INFORMATION SECTION */}

      <div className="mt-16 grid grid-cols-3 gap-8">

        {/* EMI FORMULA */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-3">
            How EMI is Calculated
          </h2>

          <p className="text-slate-300 text-sm mb-3">
            EMI (Equated Monthly Installment) is calculated using the formula:
          </p>

          <div className="bg-slate-900 p-3 rounded text-emerald-400 font-mono text-sm">
            EMI = P × r × (1+r)^n / ((1+r)^n − 1)
          </div>

          <div className="mt-3 text-sm text-slate-300">
            <p>P = Loan Amount</p>
            <p>r = Monthly Interest Rate</p>
            <p>n = Number of Months</p>
          </div>

        </div>

        {/* EXAMPLE */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-3">
            Example EMI
          </h2>

          <p className="text-slate-300 text-sm">
            If you take a loan of ₹1,00,000 at 10% interest for 12 months,
            your EMI will be approximately:
          </p>

          <p className="text-2xl text-emerald-400 font-bold mt-4">
            ₹8,791 / month
          </p>

        </div>

        {/* TIPS */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-3">
            EMI Tips
          </h2>

          <ul className="text-slate-300 text-sm space-y-2">
            <li>• Choose longer tenure to reduce EMI.</li>
            <li>• Compare bank interest rates before borrowing.</li>
            <li>• Maintain a good credit score.</li>
            <li>• Avoid multiple loans at the same time.</li>
          </ul>

        </div>

      </div>

    </div>
  );
};