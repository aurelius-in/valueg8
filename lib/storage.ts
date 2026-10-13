const STORAGE_KEY = "valueg8:evaluations";
const STORAGE_VERSION_KEY = "valueg8:version";
const STORAGE_VERSION = 1;

export type StoredEvaluation = {
  id: string;
  title: string;
  organization?: string;
  businessUnit?: string;
  initiativeDescription?: string;
  whoUsesIt?: string;
  decisionOrWorkflowChange?: string;
  aiRole?: string;
  strategicPosture?: string;
  stage?: string;
  currentProcess?: string;
  currentWorkaround?: string;
  primaryPain?: string;
  whoFeelsPain?: string;
  whoOwnsExistingProcess?: string;
  frequency?: string;
  annualTransactionVolume?: number;
  averageMinutesPerCase?: number;
  loadedLaborCostPerHour?: number;
  currentAnnualSoftwareCost?: number;
  currentErrorReworkRate?: number;
  currentCycleTime?: string;
  currentKpi?: string;
  baselineKpiValue?: number;
  targetKpiValue?: number;
  ifInitiativeDisappeared?: string;
  valueMechanisms: any[];
  successCriteria?: string;
  beneficiaries?: string;
  budgetOwner?: string;
  evidence: any[];
  dataSources: any[];
  evaluationMethod?: string;
  outputsObjectivelyChecked?: "Yes" | "Partially" | "No";
  dataFreshness?: string;
  deployment: any;
  control: any;
  economics: any;
  commitment: any;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
};

export function getStorageVersion(): number {
  if (typeof window === "undefined") return STORAGE_VERSION;
  const raw = window.localStorage.getItem(STORAGE_VERSION_KEY);
  return raw ? Number(raw) : STORAGE_VERSION;
}

export function ensureStorageVersion() {
  if (typeof window === "undefined") return;
  const current = getStorageVersion();
  if (current !== STORAGE_VERSION) {
    window.localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
  }
}

export function readEvaluations(): StoredEvaluation[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeEvaluations(items: StoredEvaluation[]) {
  if (typeof window === "undefined") return;
  ensureStorageVersion();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function saveEvaluation(evaluation: StoredEvaluation) {
  const items = readEvaluations();
  const idx = items.findIndex((item) => item.id === evaluation.id);
  const now = new Date().toISOString();
  const withTime = {
    ...evaluation,
    createdAt: idx >= 0 ? items[idx]?.createdAt ?? now : now,
    updatedAt: now,
    lastUpdated: now,
  };

  if (idx >= 0) items[idx] = withTime;
  else items.unshift(withTime);

  writeEvaluations(items);
  return withTime;
}

export function getEvaluationById(id: string): StoredEvaluation | undefined {
  return readEvaluations().find((item) => item.id === id);
}

export function deleteEvaluation(id: string) {
  writeEvaluations(readEvaluations().filter((item) => item.id !== id));
}

export function duplicateEvaluation(id: string): StoredEvaluation | undefined {
  const source = getEvaluationById(id);
  if (!source) return undefined;
  const duplicate: StoredEvaluation = {
    ...source,
    id: `${source.id}-${Date.now()}`,
    title: `${source.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
  saveEvaluation(duplicate);
  return duplicate;
}
