export enum Decision {
  READY_TO_PILOT = "READY_TO_PILOT",
  LEARN_FIRST = "LEARN_FIRST",
  DO_NOT_PRIORITIZE = "DO_NOT_PRIORITIZE",
}

export enum EvidenceType {
  OBSERVED = "OBSERVED",
  SPONSOR_REPORTED = "SPONSOR_REPORTED",
  ASSUMED = "ASSUMED",
}

export type NumericRange = { low?: number; high?: number };

export type EvidenceItem = {
  id: string;
  claim: string;
  type: EvidenceType;
  source: string;
  date?: string;
  confidence: number;
  notes?: string;
};

export type DataSource = {
  id: string;
  name: string;
  owner?: string;
  accessStatus?: "Available" | "Permission needed" | "Integration needed" | "Unknown" | "Unavailable";
  quality?: "Known good" | "Mixed" | "Unknown" | "Poor";
  sensitivity?: string;
  freshnessRequirement?: "real time" | "near real time" | "daily" | "static/batch" | "unknown";
  groundTruthStatus?: "Exists and is representative" | "Exists but incomplete" | "Can be created" | "Unknown" | "No practical ground truth";
};

export type ValueMechanism = {
  id: string;
  mechanism: string;
  description: string;
  baseline?: string;
  expectedChange?: string;
  unit?: string;
  annualValueEstimate?: NumericRange;
  evidenceType?: EvidenceType;
  confidence?: number;
};

export type CostInputs = {
  oneTimeDiscovery?: number;
  oneTimeEngineering?: number;
  oneTimeIntegration?: number;
  oneTimeSecurityCompliance?: number;
  oneTimeChangeTraining?: number;
  annualModelInference?: number;
  annualInfrastructure?: number;
  annualVendorSoftware?: number;
  annualSupportOperations?: number;
  annualHumanReview?: number;
  annualMaintenance?: number;
  contingencyPercent?: number;
};

export type DeploymentInputs = {
  deploymentModes?: string[];
  dataRestrictionsAgainstLeavingControlledInfra?: "Yes" | "No" | "Unknown";
  modelProviderLockInAcceptable?: "Yes" | "No" | "Unknown";
  mustRetainModelOptionality?: boolean;
  latencyRequirement?: string;
  expectedMonthlyInferenceApiCost?: number;
  expectedAnnualHostedCloudCost?: number;
  expectedPrivateHardwareCapex?: number;
  expectedPrivateAnnualOperationsCost?: number;
  existingInfrastructure?: string;
};

export type ControlInputs = {
  externalSideEffect?: "No, advisory only" | "Yes, reversible" | "Yes, potentially irreversible" | "Unknown";
  humanApprovalBeforeConsequentialAction?: "Always" | "Risk-based" | "Never" | "Not designed yet";
  actionsCanBeReversed?: "Yes" | "Sometimes" | "No" | "Unknown";
  auditCoverage?: string[];
  failureImpact?: "Low" | "Moderate" | "High" | "Critical";
  complianceConsiderations?: string[];
  governanceOwnerNamed?: boolean;
  escalationPathDefined?: boolean;
  rollbackKillMechanismDefined?: boolean;
};

export type CommitmentInputs = {
  hasExecutiveSponsor?: boolean;
  hasOperationalOwner?: boolean;
  hasBudgetOwner?: boolean;
  budgetStatus?: "none" | "exploring" | "provisional" | "approved" | "funded pilot";
  targetDecisionDate?: string | null;
  pilotDate?: string | null;
  hasRealUserParticipation?: boolean;
  hasDataAccessCommitment?: boolean;
  hasRejectionCriterion?: boolean;
  rejectionCriterion?: string;
  stopCondition?: string;
  expansionCondition?: string;
};

export type DimensionScore = {
  dimension: string;
  score: number;
  reason: string;
  evidence: string[];
  whatWouldImproveIt: string[];
};

export type Blocker = {
  id: string;
  title: string;
  severity: "STOP" | "LEARN";
  reason: string;
};

export type DecisionResult = {
  decision: Decision;
  overallScore: number;
  dimensionScores: DimensionScore[];
  blockers: Blocker[];
  reasons: string[];
  evidenceStrength: "Weak" | "Developing" | "Moderate" | "Strong";
  dataReadiness: "Weak" | "Developing" | "Moderate" | "Strong";
  controlReadiness: "Weak" | "Developing" | "Moderate" | "Strong";
};

export type Evaluation = {
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
  valueMechanisms: ValueMechanism[];
  successCriteria?: string;
  beneficiaries?: string;
  budgetOwner?: string;
  evidence: EvidenceItem[];
  dataSources: DataSource[];
  evaluationMethod?: string;
  outputsObjectivelyChecked?: "Yes" | "Partially" | "No";
  dataFreshness?: string;
  deployment: DeploymentInputs;
  control: ControlInputs;
  economics: CostInputs;
  commitment: CommitmentInputs;
  lastUpdated?: string;
};

const DIMENSION_WEIGHTS = {
  "Business Value": 15,
  "Workflow Fit": 15,
  Evidence: 15,
  "Data Readiness": 15,
  "Deployment Feasibility": 10,
  "Control/Governance": 15,
  Economics: 10,
  "Ownership/Commitment": 5,
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function calcEvidenceStrength(items: EvidenceItem[]) {
  if (!items.length) {
    return { score: 0, label: "Weak" as const, observedShare: 0, assumedShare: 0 };
  }

  const weightMap: Record<EvidenceType, number> = {
    [EvidenceType.OBSERVED]: 1,
    [EvidenceType.SPONSOR_REPORTED]: 0.65,
    [EvidenceType.ASSUMED]: 0.25,
  };

  const total = items.reduce((sum, item) => sum + weightMap[item.type] * (item.confidence / 5), 0);
  const avg = total / items.length;

  let label: "Weak" | "Developing" | "Moderate" | "Strong";
  if (avg < 0.3) label = "Weak";
  else if (avg < 0.55) label = "Developing";
  else if (avg < 0.75) label = "Moderate";
  else label = "Strong";

  return {
    score: Math.round(avg * 100),
    label,
    observedShare: Math.round((items.filter((i) => i.type === EvidenceType.OBSERVED).length / items.length) * 100),
    assumedShare: Math.round((items.filter((i) => i.type === EvidenceType.ASSUMED).length / items.length) * 100),
  };
}

function scoreBusinessValue(e: Evaluation): DimensionScore {
  const hasOutcome = !!e.currentKpi?.trim() && (!!e.baselineKpiValue || !!e.targetKpiValue);
  let score = 20;
  if (hasOutcome) score += 25;
  if (e.valueMechanisms.length > 0) score += Math.min(25, e.valueMechanisms.length * 8);
  if (e.successCriteria?.trim()) score += 5;
  if (!hasOutcome) score -= 20;

  const finalScore = clamp(score, 0, 100);
  return {
    dimension: "Business Value",
    score: finalScore,
    reason: finalScore >= 70 ? "There is a clear business outcome and value mechanism tied to measurable workflow change." : finalScore >= 40 ? "The initiative has plausible value, but magnitude or measurement remains uncertain." : "The initiative lacks a clear business outcome or measurable value claim.",
    evidence: [
      hasOutcome ? "Baseline or target KPI exists." : "No measurable business outcome defined.",
      e.valueMechanisms.length > 0 ? `${e.valueMechanisms.length} value mechanisms identified.` : "No value mechanisms identified.",
    ],
    whatWouldImproveIt: [
      "Define a measurable KPI with a baseline and target.",
      "Identify concrete value mechanisms and affected budget owner.",
    ],
  };
}

function scoreWorkflowFit(e: Evaluation): DimensionScore {
  let score = 15;
  if (e.currentProcess?.trim()) score += 20;
  if (e.primaryPain?.trim()) score += 20;
  if (e.whoUsesIt?.trim()) score += 15;
  if (e.decisionOrWorkflowChange?.trim()) score += 20;
  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Workflow Fit",
    score: finalScore,
    reason: finalScore >= 70 ? "The workflow and pain are clear, and the initiative materially changes operating behavior." : finalScore >= 40 ? "The initiative may fit a workflow, but the current process or user impact is not fully defined." : "The workflow and pain are not defined well enough to justify investment.",
    evidence: [
      e.currentProcess?.trim() ? "Current process described." : "Current process not described.",
      e.primaryPain?.trim() ? "Pain identified." : "Pain not identified.",
      e.whoUsesIt?.trim() ? "User group defined." : "User group not defined.",
    ],
    whatWouldImproveIt: [
      "Describe the workflow before AI in concrete steps.",
      "Document who feels the pain and what the current workaround is.",
    ],
  };
}

function scoreEvidence(e: Evaluation): DimensionScore {
  const evidenceSummary = calcEvidenceStrength(e.evidence);
  let score = evidenceSummary.score;
  if (evidenceSummary.assumedShare > 50) score -= 20;
  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Evidence",
    score: finalScore,
    reason: finalScore >= 70 ? "The initiative is supported by strong observed or sponsor-backed evidence." : finalScore >= 40 ? "The initiative has some evidence, but a significant share remains assumed." : "Evidence is weak and the initiative depends on hypothesis.",
    evidence: [
      `${e.evidence.length} evidence items captured.`,
      `${evidenceSummary.observedShare}% observed.`,
      `${evidenceSummary.assumedShare}% assumed.`,
    ],
    whatWouldImproveIt: [
      "Collect observed evidence from the workflow or prior measurements.",
      "Reduce assumption-heavy value claims with clear source references.",
    ],
  };
}

function scoreDataReadiness(e: Evaluation): DimensionScore {
  if (e.dataSources.length === 0) {
    return { dimension: "Data Readiness", score: 10, reason: "No data sources are defined, so the initiative lacks a credible data path.", evidence: ["No data sources captured."], whatWouldImproveIt: ["List required data sources and owners.", "Confirm access and quality."] };
  }

  let score = 30;
  const available = e.dataSources.filter((s) => s.accessStatus === "Available").length;
  const permissionNeeded = e.dataSources.filter((s) => s.accessStatus === "Permission needed").length;
  const integrationNeeded = e.dataSources.filter((s) => s.accessStatus === "Integration needed").length;
  const unavailable = e.dataSources.filter((s) => s.accessStatus === "Unavailable").length;

  score += available * 12;
  score += permissionNeeded * 4;
  score -= integrationNeeded * 6;
  score -= unavailable * 20;
  if (e.evaluationMethod?.trim()) score += 12;
  if (e.outputsObjectivelyChecked === "Yes") score += 15;
  else if (e.outputsObjectivelyChecked === "Partially") score += 7;

  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Data Readiness",
    score: finalScore,
    reason: finalScore >= 70 ? "The data path and evaluation design are credible." : finalScore >= 40 ? "Some data access is viable, but dependencies remain unresolved." : "Critical data access or evaluation design is unresolved.",
    evidence: [
      `${available} sources are available.`,
      `${permissionNeeded} require approvals.`,
      `${integrationNeeded} require integration work.`,
      `${unavailable} are unavailable.`,
    ],
    whatWouldImproveIt: [
      "Confirm access to required data sources and owners.",
      "Document how outputs will be objectively evaluated.",
    ],
  };
}

function scoreDeploymentFeasibility(e: Evaluation): DimensionScore {
  let score = 20;
  if (e.deployment.deploymentModes?.length) score += 20;
  if (e.deployment.dataRestrictionsAgainstLeavingControlledInfra === "No") score += 15;
  if (e.deployment.modelProviderLockInAcceptable === "Yes") score += 10;
  if (e.deployment.expectedAnnualHostedCloudCost !== undefined) score += 10;
  if (e.deployment.expectedPrivateHardwareCapex !== undefined) score += 10;
  if (e.deployment.latencyRequirement?.trim()) score += 5;
  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Deployment Feasibility",
    score: finalScore,
    reason: finalScore >= 70 ? "The deployment path is plausible and cost inputs are visible." : finalScore >= 40 ? "Deployment constraints are known but not fully resolved." : "The deployment path is still too uncertain for pilot commitment.",
    evidence: [
      e.deployment.deploymentModes?.length ? `${e.deployment.deploymentModes.length} deployment modes identified.` : "No deployment modes identified.",
      e.deployment.dataRestrictionsAgainstLeavingControlledInfra ? `Data restriction posture: ${e.deployment.dataRestrictionsAgainstLeavingControlledInfra}` : "Data restriction posture not defined.",
    ],
    whatWouldImproveIt: [
      "Define acceptable deployment modes and data residency constraints.",
      "Compare hosted and private cost scenarios before pilot approval.",
    ],
  };
}

function scoreControlGovernance(e: Evaluation): DimensionScore {
  let score = 15;
  if (e.control.externalSideEffect === "No, advisory only") score += 20;
  if (e.control.externalSideEffect === "Yes, reversible") score += 10;
  if (e.control.externalSideEffect === "Yes, potentially irreversible") score -= 20;
  if (e.control.humanApprovalBeforeConsequentialAction === "Always") score += 20;
  else if (e.control.humanApprovalBeforeConsequentialAction === "Risk-based") score += 10;
  else if (e.control.humanApprovalBeforeConsequentialAction === "Never") score -= 25;
  if ((e.control.auditCoverage || []).length >= 3) score += 15;
  if (e.control.governanceOwnerNamed) score += 10;
  if (e.control.escalationPathDefined) score += 10;
  if (e.control.rollbackKillMechanismDefined) score += 10;
  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Control/Governance",
    score: finalScore,
    reason: finalScore >= 70 ? "The control model is sufficiently strong for a pilot." : finalScore >= 40 ? "Some governance controls are present, but gaps remain." : "The control model is insufficient for a pilot.",
    evidence: [
      `External side effect: ${e.control.externalSideEffect}`,
      `Human approval model: ${e.control.humanApprovalBeforeConsequentialAction}`,
      `Audit coverage count: ${(e.control.auditCoverage || []).length}`,
    ],
    whatWouldImproveIt: [
      "Define approval gates before consequential action.",
      "Expand audit coverage to include evidence, tool actions, and final outcome.",
    ],
  };
}

function scoreEconomics(e: Evaluation): DimensionScore {
  const annualRecurring =
    (e.economics.annualModelInference ?? 0) +
    (e.economics.annualInfrastructure ?? 0) +
    (e.economics.annualVendorSoftware ?? 0) +
    (e.economics.annualSupportOperations ?? 0) +
    (e.economics.annualHumanReview ?? 0) +
    (e.economics.annualMaintenance ?? 0);
  const oneTime =
    (e.economics.oneTimeDiscovery ?? 0) +
    (e.economics.oneTimeEngineering ?? 0) +
    (e.economics.oneTimeIntegration ?? 0) +
    (e.economics.oneTimeSecurityCompliance ?? 0) +
    (e.economics.oneTimeChangeTraining ?? 0);
  const totalYear1 = oneTime + annualRecurring * (1 + ((e.economics.contingencyPercent ?? 20) / 100));

  let score = 50;
  if (e.valueMechanisms.length > 0) score += 10;
  if (e.economics.annualModelInference !== undefined) score += 10;
  const hasAnnualValue = e.valueMechanisms.some((m) => m.annualValueEstimate && (m.annualValueEstimate.low !== undefined || m.annualValueEstimate.high !== undefined));
  if (!hasAnnualValue) score -= 15;

  const finalScore = clamp(score, 0, 100);
  return {
    dimension: "Economics",
    score: finalScore,
    reason: finalScore >= 70 ? "The modeled economics are directionally viable under the supplied assumptions." : finalScore >= 40 ? "The funding case is not fully clear and depends on assumptions." : "The economics are weak or negative under realistic assumptions.",
    evidence: [
      `Year 1 modeled cost: ${totalYear1.toLocaleString()}`,
      hasAnnualValue ? "Annual value estimates are present." : "No annual value estimates supplied.",
    ],
    whatWouldImproveIt: [
      "Add modeled value estimates to compare against cost.",
      "Price the actual deployment path before pilot approval.",
    ],
  };
}

function scoreOwnershipCommitment(e: Evaluation): DimensionScore {
  let score = 10;
  if (e.commitment.hasExecutiveSponsor) score += 20;
  if (e.commitment.hasOperationalOwner) score += 20;
  if (e.commitment.hasBudgetOwner) score += 15;
  if (e.commitment.hasRealUserParticipation) score += 15;
  if (e.commitment.hasDataAccessCommitment) score += 10;
  if (e.commitment.hasRejectionCriterion) score += 10;
  if (!e.commitment.hasOperationalOwner) score -= 15;
  const finalScore = clamp(score, 0, 100);

  return {
    dimension: "Ownership/Commitment",
    score: finalScore,
    reason: finalScore >= 70 ? "There is a defined sponsor, owner, user commitment, and budget path." : finalScore >= 40 ? "There is some ownership, but a key role or commitment remains unresolved." : "The initiative has no credible owner or decision path.",
    evidence: [
      e.commitment.hasExecutiveSponsor ? "Executive sponsor present." : "Executive sponsor missing.",
      e.commitment.hasOperationalOwner ? "Operational owner present." : "Operational owner missing.",
      e.commitment.hasBudgetOwner ? "Budget owner present." : "Budget owner missing.",
    ],
    whatWouldImproveIt: [
      "Assign a named operational owner and budget owner.",
      "Define pilot criteria and rejection criteria.",
    ],
  };
}

function buildHardGates(e: Evaluation): Blocker[] {
  const blockers: Blocker[] = [];
  if (e.dataSources.some((s) => s.accessStatus === "Unavailable")) {
    blockers.push({ id: "critical-data-unavailable", title: "Critical data unavailable", severity: "STOP", reason: "Critical required data is unavailable." });
  }
  if (e.control.externalSideEffect === "Yes, potentially irreversible" && e.control.humanApprovalBeforeConsequentialAction === "Never") {
    blockers.push({ id: "irreversible-action", title: "Irreversible action without approval control", severity: "STOP", reason: "Consequential irreversible action lacks a human control gate." });
  }
  if (!e.currentKpi?.trim()) {
    blockers.push({ id: "no-baseline", title: "No measurable baseline", severity: "LEARN", reason: "No measurable baseline or KPI definition is present." });
  }
  if (!e.commitment.hasOperationalOwner) {
    blockers.push({ id: "no-operational-owner", title: "No operational owner", severity: "LEARN", reason: "There is no clear operational owner for the workflow." });
  }
  return blockers;
}

export function scoreEvaluation(evalData: Evaluation): DecisionResult {
  const dimensions = [
    scoreBusinessValue(evalData),
    scoreWorkflowFit(evalData),
    scoreEvidence(evalData),
    scoreDataReadiness(evalData),
    scoreDeploymentFeasibility(evalData),
    scoreControlGovernance(evalData),
    scoreEconomics(evalData),
    scoreOwnershipCommitment(evalData),
  ];

  const weighted = dimensions.reduce((sum, d) => sum + (d.score * (DIMENSION_WEIGHTS[d.dimension as keyof typeof DIMENSION_WEIGHTS] ?? 0)) / 100, 0);
  const overallScore = clamp(Math.round(weighted), 0, 100);
  const blockers = buildHardGates(evalData);
  const stopBlockers = blockers.filter((b) => b.severity === "STOP");
  const learnBlockers = blockers.filter((b) => b.severity === "LEARN");

  let decision = Decision.LEARN_FIRST;
  if (stopBlockers.length > 0) decision = Decision.DO_NOT_PRIORITIZE;
  else if (overallScore >= 70 && !learnBlockers.length && !!evalData.commitment.hasOperationalOwner && !!evalData.currentKpi?.trim()) decision = Decision.READY_TO_PILOT;

  const evidenceSummary = calcEvidenceStrength(evalData.evidence);
  let evidenceStrength: DecisionResult["evidenceStrength"] = "Weak";
  if (evidenceSummary.score >= 75) evidenceStrength = "Strong";
  else if (evidenceSummary.score >= 50) evidenceStrength = "Moderate";
  else if (evidenceSummary.score >= 30) evidenceStrength = "Developing";

  let dataReadiness: DecisionResult["dataReadiness"] = "Weak";
  const dataScore = scoreDataReadiness(evalData).score;
  if (dataScore >= 75) dataReadiness = "Strong";
  else if (dataScore >= 50) dataReadiness = "Moderate";
  else if (dataScore >= 30) dataReadiness = "Developing";

  let controlReadiness: DecisionResult["controlReadiness"] = "Weak";
  const controlScore = scoreControlGovernance(evalData).score;
  if (controlScore >= 75) controlReadiness = "Strong";
  else if (controlScore >= 50) controlReadiness = "Moderate";
  else if (controlScore >= 30) controlReadiness = "Developing";

  return {
    decision,
    overallScore,
    dimensionScores: dimensions,
    blockers,
    reasons: [
      decision === Decision.READY_TO_PILOT ? "No hard stop blockers and the initiative has enough evidence, governance, and ownership to justify a pilot." : decision === Decision.LEARN_FIRST ? "The initiative has a plausible case but requires more evidence, workflow clarity, or governance before pilot approval." : "The initiative is blocked by hard constraints or unacceptable risk.",
    ],
    evidenceStrength,
    dataReadiness,
    controlReadiness,
  };
}
