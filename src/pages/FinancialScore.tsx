export const FinancialScore = () => {
  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Financial Health Score</h1>

      <div className="bg-slate-800 p-6 rounded-xl w-72">
        <h2 className="text-lg mb-2">Your Score</h2>

        <div className="text-4xl font-bold text-emerald-400">
          78 / 100
        </div>

        <p className="text-slate-400 mt-3">
          Good financial stability. Keep managing loans and expenses properly.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl mb-2">Suggestions</h3>
        <ul className="list-disc ml-6 text-slate-300">
          <li>Reduce unnecessary expenses</li>
          <li>Maintain emergency savings</li>
          <li>Pay EMIs on time</li>
        </ul>
      </div>
    </div>
  );
};