export default function MethodPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h1 className="text-4xl font-black tracking-tight">An AI initiative should earn implementation.</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          ValueGate separates observed evidence, sponsor-reported claims, and assumptions so the decision reflects reality instead of optimism.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold">The distinction matters</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><strong>OBSERVED</strong> = directly measured or documented</li>
            <li><strong>SPONSOR-REPORTED</strong> = stated by a stakeholder but not independently verified</li>
            <li><strong>ASSUMED</strong> = a hypothesis that has not yet been validated</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold">Why this exists</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Scores organize evidence; they do not prove value.</li>
            <li>Hard gates override weighted scoring.</li>
            <li>Calculated ROI is a model, not a fact.</li>
            <li>Readiness is not demand.</li>
            <li>The objective is to expose the next decision, not justify a project someone already wants.</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold">Scoring dimensions and weights</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Business Value", "15"],
            ["Workflow Fit", "15"],
            ["Evidence", "15"],
            ["Data Readiness", "15"],
            ["Deployment Feasibility", "10"],
            ["Control/Governance", "15"],
            ["Economics", "10"],
            ["Ownership/Commitment", "5"],
          ].map(([label, weight]) => (
            <div key={label} className="rounded-md border border-slate-200 p-3">
              <div className="font-semibold">{label}</div>
              <div className="text-sm text-slate-600">Weight: {weight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
