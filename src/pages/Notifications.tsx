export const Notifications = () => {
  return (
    <div className="text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      <div className="space-y-4">

        <div className="bg-slate-800 p-4 rounded-lg">
          EMI payment due in 5 days.
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          New government scheme available for small businesses.
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          Financial literacy module completed successfully.
        </div>

      </div>

    </div>
  );
};