"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  deleteEvaluation,
  duplicateEvaluation,
  readEvaluations,
  saveEvaluation,
  type StoredEvaluation,
} from "@/lib/storage";
import { importEvaluationFromJson } from "@/lib/export";
import { sampleEvaluation } from "@/lib/sample";

export default function HomePage() {
  const [items, setItems] = useState<StoredEvaluation[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const load = () => setItems(readEvaluations());

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this evaluation?");
    if (!confirmed) return;
    deleteEvaluation(id);
    load();
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateEvaluation(id);
    if (duplicated) load();
  };

  const handleExport = (evaluation: StoredEvaluation) => {
    const json = JSON.stringify(evaluation, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${evaluation.title || "evaluation"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = importEvaluationFromJson(text);
    if (!parsed) {
      window.alert("Invalid evaluation JSON.");
      return;
    }

    const normalized = {
      ...parsed,
      id: parsed.id || `import-${Date.now()}`,
      title: parsed.title || "Imported evaluation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEvaluation(normalized as any);
    load();
  };

  const hasEvaluations = items.length > 0;

  return (
    <div className="space-y-10">
      {!hasEvaluations ? (
        <div className="space-y-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Kill weak AI ideas before they hit the roadmap.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-700">
                ValueGate stress-tests an AI initiative across business value, workflow fit,
                evidence, data readiness, economics, deployment constraints, and governance before
                a team commits implementation capacity.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/evaluation/new" className="rounded-md bg-[#0a6dff] px-5 py-3 text-base font-semibold text-white">
                  Start an evaluation
                </Link>
                <Link href="/evaluation/sample" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800">
                  Open sample
                </Link>
              </div>
            </div>
          </section>

          <section>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Value", "Is the business outcome measurable?"],
                ["Workflow", "Does AI actually improve the operating process?"],
                ["Evidence", "What is observed versus assumed?"],
                ["Data", "Can the system access trustworthy inputs and evaluate outputs?"],
                ["Economics", "Does the modeled value survive realistic implementation and operation costs?"],
                ["Control", "Can the system be deployed, governed, audited, and reversed safely?"],
              ].map(([label, desc]) => (
                <div key={label} className="card p-5">
                  <div className="label mb-2">{label}</div>
                  <p className="text-sm text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-8">
            <p className="text-lg font-medium text-slate-800">ValueGate does not ask whether AI could do something.</p>
            <p className="mt-2 text-slate-600">It asks whether this initiative has earned the right to consume resources.</p>
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">Evaluations</h2>

            <div className="flex flex-wrap gap-3">
              <Link href="/evaluation/new" className="rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white">
                New Evaluation
              </Link>

              <Link href="/compare" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Compare initiatives
              </Link>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Import JSON
              </button>

              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="card p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {item.title === sampleEvaluation.title ? "SAMPLE" : "Draft"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div>Organization: {item.organization || "—"}</div>
                  <div>Owner: {item.businessUnit || "—"}</div>
                  <div>Last updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-slate-50 p-2">
                    <div className="label">Gate</div>
                    <div className="mt-1 font-semibold">—</div>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2">
                    <div className="label">Evidence</div>
                    <div className="mt-1 font-semibold">—</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/evaluation/${item.id}`} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                    Edit
                  </Link>
                  <Link href={`/evaluation/${item.id}`} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                    View decision
                  </Link>
                  <button type="button" onClick={() => handleDuplicate(item.id)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                    Duplicate
                  </button>
                  <button type="button" onClick={() => handleExport(item)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                    Export JSON
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
