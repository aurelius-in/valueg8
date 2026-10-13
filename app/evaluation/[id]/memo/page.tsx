"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEvaluationById } from "@/lib/storage";
import { scoreEvaluation, type Evaluation } from "@/lib/scoring";

export default function EvaluationMemoPage({ params }: { params: { id: string } }) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    const item = getEvaluationById(params.id);
    if (item) setEvaluation(item);
  }, [params.id]);

  if (!evaluation) {
    return <div className="card p-8">Loading memo…</div>;
  }

  const result = scoreEvaluation(evaluation);

  const markdown = `# VALUEGATE
## AI INITIATIVE DECISION MEMO

- Initiative: ${evaluation.title || "Not defined"}
- Organization: ${evaluation.organization || "Not defined"}
- Date: ${new Date().toISOString().slice(0, 10)}
- Decision: ${result.decision}

## 1. Proposed initiative
${evaluation.initiativeDescription || "[Not defined]"}

## 2. Workflow being changed
${evaluation.currentProcess || "[Not defined]"}

## 3. Business outcome
${evaluation.currentKpi || "[Not defined]"}

## 4. Current baseline
Baseline: ${evaluation.baselineKpiValue ?? "[Not defined]"}
Target: ${evaluation.targetKpiValue ?? "[Not defined]"}

## 5. Evidence summary
${evaluation.evidence.map((item) => `- ${item.type}: ${item.claim}`).join("\n") || "[No evidence captured]"}

## 6. Key blockers
${result.blockers.map((b) => `- ${b.title}: ${b.reason}`).join("\n") || "None identified"}

## 7. Decision rationale
${result.reasons.join(" ")}`;

  const print = () => window.print();
  const copyMarkdown = async () => navigator.clipboard.writeText(markdown);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={print} className="rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white">Print</button>
        <button type="button" onClick={copyMarkdown} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Copy as Markdown</button>
        <Link href={`/evaluation/${params.id}`} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to decision</Link>
      </div>

      <div className="card p-8 print:p-0">
        <div className="border-b border-slate-200 pb-6">
          <div className="text-3xl font-black tracking-tight">VALUEGATE</div>
          <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">AI INITIATIVE DECISION MEMO</div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InfoRow label="Initiative" value={evaluation.title || "[Not defined]"} />
          <InfoRow label="Organization" value={evaluation.organization || "[Not defined]"} />
          <InfoRow label="Date" value={new Date().toISOString().slice(0, 10)} />
          <InfoRow label="Decision" value={result.decision} />
        </div>

        <div className="mt-8 space-y-8">
          <Section title="1. Proposed initiative"><p>{evaluation.initiativeDescription || "[Not defined]"}</p></Section>
          <Section title="2. Workflow being changed"><p>{evaluation.currentProcess || "[Not defined]"}</p></Section>
          <Section title="3. Business outcome"><p>{evaluation.currentKpi || "[Not defined]"}</p></Section>
          <Section title="4. Current baseline"><p>Baseline: {evaluation.baselineKpiValue ?? "[Not defined]"}</p><p>Target: {evaluation.targetKpiValue ?? "[Not defined]"}</p></Section>
          <Section title="5. Evidence summary">{evaluation.evidence.length === 0 ? <p>[No evidence captured]</p> : <ul className="list-disc pl-5">{evaluation.evidence.map((item) => <li key={item.id}><strong>{item.type}</strong>: {item.claim}</li>)}</ul>}</Section>
          <Section title="6. Key blockers">{result.blockers.length === 0 ? <p>None identified.</p> : <ul className="list-disc pl-5">{result.blockers.map((blocker) => <li key={blocker.id}><strong>{blocker.title}</strong>: {blocker.reason}</li>)}</ul>}</Section>
          <Section title="7. Decision rationale"><p>{result.reasons.join(" ")}</p></Section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="label">{label}</div>
      <div className="mt-2 font-medium text-slate-800">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </section>
  );
}
