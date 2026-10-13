"use client";

import { useEffect, useState } from "react";
import { readEvaluations } from "@/lib/storage";
import { scoreEvaluation } from "@/lib/scoring";

export default function ComparePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const values = readEvaluations();
    setItems(values);
    setSelected(values.slice(0, 2).map((item) => item.id));
  }, []);

  const scored = items
    .map((item) => ({ ...item, result: scoreEvaluation(item) }))
    .filter((item) => selected.includes(item.id));

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Portfolio compare</h1>
        <p className="mt-2 text-slate-600">Compare initiative readiness, evidence quality, modeled value, and implementation effort.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => {
            const checked = selected.includes(item.id);
            return (
              <label key={item.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    if (checked) setSelected((prev) => prev.filter((id) => id !== item.id));
                    else if (selected.length < 5) setSelected((prev) => [...prev, item.id]);
                  }}
                />
                <span>{item.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Decision</th>
                <th className="px-4 py-3 font-semibold">Business Value</th>
                <th className="px-4 py-3 font-semibold">Workflow Fit</th>
                <th className="px-4 py-3 font-semibold">Evidence</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Control</th>
                <th className="px-4 py-3 font-semibold">Economics</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{item.result.decision}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Business Value")?.score ?? 0}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Workflow Fit")?.score ?? 0}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Evidence")?.score ?? 0}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Data Readiness")?.score ?? 0}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Control/Governance")?.score ?? 0}</td>
                  <td className="px-4 py-3">{item.result.dimensionScores.find((d: any) => d.dimension === "Economics")?.score ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
