"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getEvaluationById } from "@/lib/storage";
import { scoreEvaluation, type Evaluation } from "@/lib/scoring";

export default function EvaluationDecisionPage({ params }: { params: { id: string } }) {
  const [evalData, setEvalData] = useState<Evaluation | null>(null);

  useEffect(() => {
    const item = getEvaluationById(params.id);
    if (item) setEvalData(item);
  }, [params.id]);

  const result = useMemo(() => {
    if (!evalData) return null;
    return scoreEvaluation(evalData);
  }, [evalData]);

  if (!evalData || !result) {
    return <div className="card p-8">Loading evaluation…</div>;
  }

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="label">ValueGate decision</div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{result.decision.replace("_", " ")}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          {result.decision === "READY_TO_PILOT"
            ? "The workflow and value case are plausible, and the initiative has enough evidence and commitment to justify a pilot."
            : result.decision === "LEARN_FIRST"
              ? "The initiative has a plausible case, but evidence, data access, governance, or baseline work remains unresolved."
              : "The initiative should not advance because a hard blocker or unacceptable risk remains."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/evaluation/${params.id}/memo`} className="rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white">Decision Memo</Link>
          <Link href="/" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Dashboard</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Evidence Strength" value={result.evidenceStrength} />
        <MetricCard label="Data Readiness" value={result.dataReadiness} />
        <MetricCard label="Control Readiness" value={result.controlReadiness} />
        <MetricCard label="Overall Score" value={`${result.overallScore}/100`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold">Why this decision</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {result.dimensionScores.slice(0, 5).map((score) => (
              <li key={score.dimension} className="rounded-md border border-slate-200 p-3">
                <div className="font-semibold">{score.dimension}</div>
                <div className="mt-1">{score.reason}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold">Hard blockers</h3>
          {result.blockers.length === 0 ? (
            <div className="mt-3 text-sm text-slate-600">No stop blockers.</div>
          ) : (
            <ul className="mt-4 space-y-3">
              {result.blockers.map((blocker) => (
                <li key={blocker.id} className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <div className="font-semibold">{blocker.title}</div>
                  <div className="mt-1">{blocker.reason}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold">Decision trace</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pr-6 font-semibold">Dimension</th>
                <th className="pb-3 pr-6 font-semibold">Score</th>
                <th className="pb-3 pr-6 font-semibold">Evidence</th>
                <th className="pb-3 pr-6 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {result.dimensionScores.map((score) => (
                <tr key={score.dimension} className="border-b border-slate-200 align-top">
                  <td className="py-3 pr-6">{score.dimension}</td>
                  <td className="py-3 pr-6">{score.score}</td>
                  <td className="py-3 pr-6">{score.evidence.join("; ")}</td>
                  <td className="py-3 pr-6">{score.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="label">{label}</div>
      <div className="mt-2 text-xl font-bold">{value}</div>
    </div>
  );
}
