export const Analytics = () => {
  return (
    <div className="text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Financial Analytics
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-lg">Monthly Income</h3>
          <p className="text-2xl mt-2">₹45,000</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-lg">Monthly Expenses</h3>
          <p className="text-2xl mt-2">₹28,000</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-lg">Savings</h3>
          <p className="text-2xl mt-2 text-emerald-400">₹17,000</p>
        </div>

      </div>

      <div className="mt-8 text-slate-400">
        Graph visualization can be added here later using chart libraries.
      </div>

    </div>
  );
};