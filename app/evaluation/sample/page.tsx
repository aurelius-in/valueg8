"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveEvaluation } from "@/lib/storage";
import { sampleEvaluation } from "@/lib/sample";

export default function SampleEvaluationPage() {
  const router = useRouter();

  useEffect(() => {
    const clone = {
      ...sampleEvaluation,
      id: `sample-${Date.now()}`,
      title: "Claims Support Copilot",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;
    saveEvaluation(clone);
    router.push(`/evaluation/${clone.id}`);
  }, [router]);

  return <div className="card p-8"><div className="label">Sample evaluation</div><h1 className="mt-2 text-2xl font-bold">Loading sample…</h1></div>;
}
