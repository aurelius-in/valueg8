"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveEvaluation, readEvaluations } from "@/lib/storage";
import type { Evaluation } from "@/lib/scoring";

const steps = [
  "Initiative",
  "Current Workflow",
  "Value",
  "Evidence",
  "Data",
  "Deployment",
  "Control",
  "Economics",
  "Commitment",
  "Decision",
];

const defaultEvaluation: Evaluation = {
  id: "",
  title: "",
  organization: "",
  businessUnit: "",
  initiativeDescription: "",
  whoUsesIt: "",
  decisionOrWorkflowChange: "",
  aiRole: "Assist",
  strategicPosture: "Improve an existing workflow",
  stage: "Idea",
  currentProcess: "",
  currentWorkaround: "",
  primaryPain: "",
  whoFeelsPain: "",
  whoOwnsExistingProcess: "",
  frequency: "daily",
  annualTransactionVolume: undefined,
  averageMinutesPerCase: undefined,
  loadedLaborCostPerHour: undefined,
  currentAnnualSoftwareCost: undefined,
  currentErrorReworkRate: undefined,
  currentCycleTime: "",
  currentKpi: "",
  baselineKpiValue: undefined,
  targetKpiValue: undefined,
  ifInitiativeDisappeared: "",
  valueMechanisms: [],
  successCriteria: "",
  beneficiaries: "",
  budgetOwner: "",
  evidence: [],
  dataSources: [],
  evaluationMethod: "",
  outputsObjectivelyChecked: "Partially",
  dataFreshness: "daily",
  deployment: {
    deploymentModes: [],
    dataRestrictionsAgainstLeavingControlledInfra: "Unknown",
    modelProviderLockInAcceptable: "Unknown",
    mustRetainModelOptionality: false,
    latencyRequirement: "",
    expectedMonthlyInferenceApiCost: undefined,
    expectedAnnualHostedCloudCost: undefined,
    expectedPrivateHardwareCapex: undefined,
    expectedPrivateAnnualOperationsCost: undefined,
    existingInfrastructure: "",
  },
  control: {
    externalSideEffect: "No, advisory only",
    humanApprovalBeforeConsequentialAction: "Always",
    actionsCanBeReversed: "Yes",
    auditCoverage: [],
    failureImpact: "Moderate",
    complianceConsiderations: [],
    governanceOwnerNamed: false,
    escalationPathDefined: false,
    rollbackKillMechanismDefined: false,
  },
  economics: {
    oneTimeDiscovery: undefined,
    oneTimeEngineering: undefined,
    oneTimeIntegration: undefined,
    oneTimeSecurityCompliance: undefined,
    oneTimeChangeTraining: undefined,
    annualModelInference: undefined,
    annualInfrastructure: undefined,
    annualVendorSoftware: undefined,
    annualSupportOperations: undefined,
    annualHumanReview: undefined,
    annualMaintenance: undefined,
    contingencyPercent: 20,
  },
  commitment: {
    hasExecutiveSponsor: false,
    hasOperationalOwner: false,
    hasBudgetOwner: false,
    budgetStatus: "none",
    targetDecisionDate: null,
    pilotDate: null,
    hasRealUserParticipation: false,
    hasDataAccessCommitment: false,
    hasRejectionCriterion: false,
    rejectionCriterion: "",
    stopCondition: "",
    expansionCondition: "",
  },
  lastUpdated: new Date().toISOString(),
};

function makeBlankEvaluation() {
  const id = `eval-${Date.now()}`;
  return {
    ...defaultEvaluation,
    id,
    title: "New initiative",
    lastUpdated: new Date().toISOString(),
  } as Evaluation;
}

export default function NewEvaluationPage() {
  const [step, setStep] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation>(() => makeBlankEvaluation());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const existing = readEvaluations();
    if (existing.length === 0) {
      const seeded = makeBlankEvaluation();
      setEvaluation(seeded);
      saveEvaluation(seeded as any);
    } else {
      setEvaluation(existing[0]);
    }
    setIsLoaded(true);
  }, []);

  const progress = ((step + 1) / steps.length) * 100;
  const stepTitle = steps[step];

  const updateField = <K extends keyof Evaluation>(key: K, value: Evaluation[K]) => {
    setEvaluation((prev) => ({ ...prev, [key]: value, lastUpdated: new Date().toISOString() }));
  };

  const updateNested = <K extends keyof Evaluation>(key: K, patch: Partial<Evaluation[K]>) => {
    setEvaluation((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as any), ...patch },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canContinue = useMemo(() => {
    if (step === 0) return !!evaluation.title?.trim() && !!evaluation.initiativeDescription?.trim();
    if (step === 1) return !!evaluation.currentProcess?.trim() && !!evaluation.primaryPain?.trim();
    if (step === 2) return evaluation.valueMechanisms.length > 0 || !!evaluation.successCriteria?.trim();
    if (step === 3) return evaluation.evidence.length > 0;
    if (step === 4) return evaluation.dataSources.length > 0;
    return true;
  }, [step, evaluation]);

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => saveEvaluation(evaluation as any), 250);
    return () => clearTimeout(t);
  }, [evaluation, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="label">Evaluation wizard</div>
            <h2 className="mt-1 text-xl font-bold">Build initiative assessment</h2>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-700">Back to dashboard</Link>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{stepTitle}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-[#0a6dff]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">1. Initiative</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Initiative name *">
                <input value={evaluation.title || ""} onChange={(e) => updateField("title", e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Claims Support Copilot" />
              </Field>

              <Field label="Organization">
                <input value={evaluation.organization || ""} onChange={(e) => updateField("organization", e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Acme Insurance" />
              </Field>

              <Field label="Business unit">
                <input value={evaluation.businessUnit || ""} onChange={(e) => updateField("businessUnit", e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Claims Operations" />
              </Field>

              <Field label="Executive sponsor">
                <input value={evaluation.commitment.hasExecutiveSponsor ? "Yes" : "No"} readOnly className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </Field>
            </div>

            <Field label="Describe the proposed AI use case *">
              <textarea value={evaluation.initiativeDescription || ""} onChange={(e) => updateField("initiativeDescription", e.target.value)} className="mt-1 min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Describe the initiative and why it exists." />
            </Field>

            <Field label="Who uses it? *">
              <textarea value={evaluation.whoUsesIt || ""} onChange={(e) => updateField("whoUsesIt", e.target.value)} className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>

            <Field label="What decision, action, or workflow changes if it works? *">
              <textarea value={evaluation.decisionOrWorkflowChange || ""} onChange={(e) => updateField("decisionOrWorkflowChange", e.target.value)} className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="AI role">
                <Select value={evaluation.aiRole || "Assist"} onChange={(v) => updateField("aiRole", v)} options={["Assist", "Recommend", "Generate", "Classify", "Retrieve", "Automate", "Act autonomously", "Other"]} />
              </Field>

              <Field label="Strategic posture">
                <Select value={evaluation.strategicPosture || "Improve an existing workflow"} onChange={(v) => updateField("strategicPosture", v)} options={["Improve an existing workflow", "Replace an existing system/process", "Create a new capability", "Experimental / discovery", "Customer-facing product", "Internal platform capability"]} />
              </Field>

              <Field label="Stage">
                <Select value={evaluation.stage || "Idea"} onChange={(v) => updateField("stage", v)} options={["Idea", "Discovery", "Prototype", "Pilot", "Limited production", "Production expansion"]} />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">2. Current Workflow</h3>
            <Field label="Current process *">
              <textarea value={evaluation.currentProcess || ""} onChange={(e) => updateField("currentProcess", e.target.value)} className="mt-1 min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Current workaround / system *">
              <textarea value={evaluation.currentWorkaround || ""} onChange={(e) => updateField("currentWorkaround", e.target.value)} className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Primary pain or constraint *">
              <textarea value={evaluation.primaryPain || ""} onChange={(e) => updateField("primaryPain", e.target.value)} className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">3. Value</h3>
            <Field label="Relevant value mechanisms">
              <ValueMechanismPicker value={evaluation.valueMechanisms} onChange={(next) => updateField("valueMechanisms", next)} />
            </Field>
            <Field label="What must materially improve for this initiative to be considered successful? *">
              <textarea value={evaluation.successCriteria || ""} onChange={(e) => updateField("successCriteria", e.target.value)} className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">4. Evidence</h3>
            <EvidenceLedger items={evaluation.evidence} onChange={(next) => updateField("evidence", next)} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">5. Data</h3>
            <DataSourceEditor items={evaluation.dataSources} onChange={(next) => updateField("dataSources", next)} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">6. Deployment</h3>
            <Field label="Allowed deployment modes">
              <div className="mt-2 flex flex-wrap gap-3">
                {[
                  "Hosted model API",
                  "Customer VPC / BYO cloud",
                  "Private/on-prem",
                  "Local/edge",
                  "Hybrid",
                  "Not yet known",
                ].map((mode) => {
                  const checked = evaluation.deployment.deploymentModes?.includes(mode);
                  return (
                    <label key={mode} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!checked}
                        onChange={() => {
                          const nextModes = checked
                            ? (evaluation.deployment.deploymentModes || []).filter((m) => m !== mode)
                            : [...(evaluation.deployment.deploymentModes || []), mode];
                          updateNested("deployment", { deploymentModes: nextModes });
                        }}
                      />
                      <span>{mode}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">7. Control</h3>
            <Field label="Can AI output directly cause an external side effect?">
              <Select value={evaluation.control.externalSideEffect || "No, advisory only"} onChange={(v) => updateNested("control", { externalSideEffect: v as any })} options={["No, advisory only", "Yes, reversible", "Yes, potentially irreversible", "Unknown"]} />
            </Field>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">8. Economics</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="One-time engineering cost">
                <input type="number" value={evaluation.economics.oneTimeEngineering ?? ""} onChange={(e) => updateNested("economics", { oneTimeEngineering: Number(e.target.value) || undefined })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </Field>
              <Field label="Annual model / inference cost">
                <input type="number" value={evaluation.economics.annualModelInference ?? ""} onChange={(e) => updateNested("economics", { annualModelInference: Number(e.target.value) || undefined })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </Field>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">9. Commitment</h3>
            <Field label="Has a real user agreed to participate?">
              <Select value={evaluation.commitment.hasRealUserParticipation ? "Yes" : "No"} onChange={(v) => updateNested("commitment", { hasRealUserParticipation: v === "Yes" })} options={["Yes", "No"]} />
            </Field>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">10. Decision</h3>
            <DecisionPreview evaluation={evaluation} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={back} disabled={step === 0} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
          Back
        </button>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setEvaluation(makeBlankEvaluation())} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Reset
          </button>

          {step < steps.length - 1 && (
            <button type="button" onClick={next} disabled={!canContinue} className="rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
              Continue
            </button>
          )}

          {step === steps.length - 1 && (
            <Link href={`/evaluation/${evaluation.id}`} className="rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white">
              View decision
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionPreview({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="label mb-2">Summary</div>
        <div className="text-2xl font-bold">{evaluation.title || "Untitled initiative"}</div>
        <div className="mt-2 text-slate-700">{evaluation.initiativeDescription || "No description entered yet."}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Current workflow" value={evaluation.currentProcess || "Not defined"} />
        <SummaryCard title="Business outcome" value={evaluation.currentKpi || "Not defined"} />
        <SummaryCard title="Evidence captured" value={`${evaluation.evidence.length} items`} />
        <SummaryCard title="Data sources" value={`${evaluation.dataSources.length} sources`} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function ValueMechanismPicker({ value, onChange }: { value: any[]; onChange: (next: any[]) => void }) {
  const options = [
    "labor/time reduction",
    "throughput increase",
    "revenue increase",
    "conversion improvement",
    "error/rework reduction",
    "risk reduction",
    "faster decisions",
    "customer experience",
    "employee experience",
    "new capability",
    "infrastructure/vendor cost reduction",
    "other",
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {options.map((option) => {
        const checked = value.some((item) => item.mechanism === option);
        return (
          <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                if (checked) {
                  onChange(value.filter((item) => item.mechanism !== option));
                } else {
                  onChange([
                    ...value,
                    {
                      id: `vm-${Date.now()}-${option}`,
                      mechanism: option,
                      description: "",
                      baseline: "",
                      expectedChange: "",
                      unit: "",
                      evidenceType: "ASSUMED",
                      confidence: 2,
                    },
                  ]);
                }
              }}
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function EvidenceLedger({ items, onChange }: { items: any[]; onChange: (next: any[]) => void }) {
  const addEvidence = () => {
    onChange([
      ...items,
      {
        id: `ev-${Date.now()}`,
        claim: "",
        type: "ASSUMED",
        source: "",
        date: "",
        confidence: 2,
        notes: "",
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">No evidence yet. Add the first claim.</div>}

      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Claim">
              <input value={item.claim || ""} onChange={(e) => { const next = [...items]; next[index].claim = e.target.value; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Type">
              <Select value={item.type || "ASSUMED"} onChange={(v) => { const next = [...items]; next[index].type = v; onChange(next); }} options={["OBSERVED", "SPONSOR_REPORTED", "ASSUMED"]} />
            </Field>
            <Field label="Source">
              <input value={item.source || ""} onChange={(e) => { const next = [...items]; next[index].source = e.target.value; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Date">
              <input type="date" value={item.date || ""} onChange={(e) => { const next = [...items]; next[index].date = e.target.value; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Confidence 1–5">
              <input type="number" min={1} max={5} value={item.confidence || 2} onChange={(e) => { const next = [...items]; next[index].confidence = Number(e.target.value) || 1; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
            </Field>
          </div>

          <Field label="Notes">
            <textarea value={item.notes || ""} onChange={(e) => { const next = [...items]; next[index].notes = e.target.value; onChange(next); }} className="mt-1 min-h-[80px] w-full rounded-md border border-slate-300 px-3 py-2" />
          </Field>
        </div>
      ))}

      <button type="button" onClick={addEvidence} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
        Add evidence item
      </button>
    </div>
  );
}

function DataSourceEditor({ items, onChange }: { items: any[]; onChange: (next: any[]) => void }) {
  const add = () => {
    onChange([
      ...items,
      {
        id: `ds-${Date.now()}`,
        name: "",
        owner: "",
        accessStatus: "Unknown",
        quality: "Unknown",
        sensitivity: "Internal",
        freshnessRequirement: "unknown",
        groundTruthStatus: "Unknown",
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">No data sources yet. Add the required sources.</div>}

      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Source name"><input value={item.name || ""} onChange={(e) => { const next = [...items]; next[index].name = e.target.value; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></Field>
            <Field label="System owner"><input value={item.owner || ""} onChange={(e) => { const next = [...items]; next[index].owner = e.target.value; onChange(next); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></Field>
            <Field label="Access status"><Select value={item.accessStatus || "Unknown"} onChange={(v) => { const next = [...items]; next[index].accessStatus = v; onChange(next); }} options={["Available", "Permission needed", "Integration needed", "Unknown", "Unavailable"]} /></Field>
            <Field label="Quality"><Select value={item.quality || "Unknown"} onChange={(v) => { const next = [...items]; next[index].quality = v; onChange(next); }} options={["Known good", "Mixed", "Unknown", "Poor"]} /></Field>
            <Field label="Sensitivity"><Select value={item.sensitivity || "Internal"} onChange={(v) => { const next = [...items]; next[index].sensitivity = v; onChange(next); }} options={["Public", "Internal", "Confidential", "PII", "PHI", "PCI", "Regulated", "Other"]} /></Field>
            <Field label="Ground truth / evaluation data"><Select value={item.groundTruthStatus || "Unknown"} onChange={(v) => { const next = [...items]; next[index].groundTruthStatus = v; onChange(next); }} options={["Exists and is representative", "Exists but incomplete", "Can be created", "Unknown", "No practical ground truth"]} /></Field>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Add data source</button>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="label">{title}</div>
      <div className="mt-2 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}
