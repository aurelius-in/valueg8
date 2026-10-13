import { describe, expect, it } from "vitest";
import { Decision, EvidenceType, scoreEvaluation, type Evaluation } from "../lib/scoring";

describe("ValueGate scoring", () => {
  it("strong initiative with evidence and controls is READY_TO_PILOT", () => {
    const evaluation: Evaluation = {
      id: "case-1",
      title: "Strong initiative",
      currentKpi: "Cycle time",
      baselineKpiValue: 18,
      targetKpiValue: 12,
      valueMechanisms: [{ id: "vm-1", mechanism: "labor/time reduction", description: "Reduce cycle time", annualValueEstimate: { low: 600000, high: 900000 }, evidenceType: EvidenceType.OBSERVED, confidence: 5 }],
      evidence: [
        { id: "e-1", claim: "Current review time is 18 minutes", type: EvidenceType.OBSERVED, source: "Ops study", confidence: 5 },
        { id: "e-2", claim: "Copilot will improve summary quality", type: EvidenceType.SPONSOR_REPORTED, source: "Ops VP", confidence: 4 },
      ],
      dataSources: [{ id: "d-1", name: "Claims data", accessStatus: "Available", quality: "Known good", sensitivity: "Internal" }],
      evaluationMethod: "Shadow evaluation pilot",
      outputsObjectivelyChecked: "Yes",
      deployment: { deploymentModes: ["Hosted model API"], dataRestrictionsAgainstLeavingControlledInfra: "No", modelProviderLockInAcceptable: "Yes", mustRetainModelOptionality: false },
      control: { externalSideEffect: "No, advisory only", humanApprovalBeforeConsequentialAction: "Always", actionsCanBeReversed: "Yes", auditCoverage: ["input/context", "human approval", "final outcome"], failureImpact: "Moderate", complianceConsiderations: [], governanceOwnerNamed: true, escalationPathDefined: true, rollbackKillMechanismDefined: true },
      economics: { contingencyPercent: 20 },
      commitment: { hasExecutiveSponsor: true, hasOperationalOwner: true, hasBudgetOwner: true, budgetStatus: "funded pilot", targetDecisionDate: null, pilotDate: null, hasRealUserParticipation: true, hasDataAccessCommitment: true, hasRejectionCriterion: true, rejectionCriterion: "Stop if value is not realized by 50% of target.", stopCondition: "Stop if cycle time does not improve materially.", expansionCondition: "Expand if KPI improves and quality holds." },
    } as any;

    const result = scoreEvaluation(evaluation);
    expect(result.decision).toBe(Decision.READY_TO_PILOT);
  });

  it("irreversible action without approval is DO_NOT_PRIORITIZE", () => {
    const evaluation: Evaluation = {
      id: "case-2",
      title: "Irreversible action risk",
      currentKpi: "Approval throughput",
      baselineKpiValue: 100,
      targetKpiValue: 120,
      valueMechanisms: [{ id: "vm-1", mechanism: "throughput increase", description: "Increase approvals", annualValueEstimate: { low: 600000, high: 700000 }, evidenceType: EvidenceType.OBSERVED, confidence: 5 }],
      evidence: [{ id: "e-1", claim: "Current approvals are 100/day", type: EvidenceType.OBSERVED, source: "Ops logs", confidence: 5 }],
      dataSources: [{ id: "d-1", name: "Approval data", accessStatus: "Available", quality: "Known good", sensitivity: "Internal" }],
      evaluationMethod: "Pilot measurement",
      outputsObjectivelyChecked: "Yes",
      deployment: { deploymentModes: ["Hosted model API"], dataRestrictionsAgainstLeavingControlledInfra: "No", modelProviderLockInAcceptable: "Yes", mustRetainModelOptionality: false },
      control: { externalSideEffect: "Yes, potentially irreversible", humanApprovalBeforeConsequentialAction: "Never", actionsCanBeReversed: "No", auditCoverage: [], failureImpact: "Critical", complianceConsiderations: [], governanceOwnerNamed: false, escalationPathDefined: false, rollbackKillMechanismDefined: false },
      economics: { contingencyPercent: 20 },
      commitment: { hasExecutiveSponsor: true, hasOperationalOwner: true, hasBudgetOwner: true, budgetStatus: "approved", targetDecisionDate: null, pilotDate: null, hasRealUserParticipation: true, hasDataAccessCommitment: true, hasRejectionCriterion: true, rejectionCriterion: "Stop if approval error rate rises.", stopCondition: "Stop if approval quality regresses.", expansionCondition: "Expand if throughput rises without error." },
    } as any;

    const result = scoreEvaluation(evaluation);
    expect(result.decision).toBe(Decision.DO_NOT_PRIORITIZE);
  });

  it("strong value but missing data leads to LEARN_FIRST", () => {
    const evaluation: Evaluation = {
      id: "case-3",
      title: "Mostly assumed value",
      currentKpi: "Case speed",
      baselineKpiValue: 20,
      targetKpiValue: 12,
      valueMechanisms: [{ id: "vm-1", mechanism: "labor/time reduction", description: "Reduce review time", annualValueEstimate: { low: 700000, high: 1200000 }, evidenceType: EvidenceType.ASSUMED, confidence: 2 }],
      evidence: [{ id: "e-1", claim: "AI will improve cycle time", type: EvidenceType.ASSUMED, source: "Draft estimate", confidence: 2 }],
      dataSources: [{ id: "d-1", name: "Operational data", accessStatus: "Available", quality: "Mixed" }],
      evaluationMethod: "does not exist yet",
      outputsObjectivelyChecked: "Partially",
      deployment: { deploymentModes: ["Hosted model API"], dataRestrictionsAgainstLeavingControlledInfra: "Unknown", modelProviderLockInAcceptable: "Unknown", mustRetainModelOptionality: true },
      control: { externalSideEffect: "No, advisory only", humanApprovalBeforeConsequentialAction: "Always", actionsCanBeReversed: "Yes", auditCoverage: ["input/context", "human approval"], failureImpact: "Moderate", complianceConsiderations: [], governanceOwnerNamed: false, escalationPathDefined: false, rollbackKillMechanismDefined: false },
      economics: { contingencyPercent: 20 },
      commitment: { hasExecutiveSponsor: true, hasOperationalOwner: true, hasBudgetOwner: true, budgetStatus: "exploring", targetDecisionDate: null, pilotDate: null, hasRealUserParticipation: true, hasDataAccessCommitment: true, hasRejectionCriterion: true, rejectionCriterion: "Stop if time savings fade.", stopCondition: "Stop if no measurable cycle time gain at 50% realization.", expansionCondition: "Expand if KPI improvement is clear and sustained." },
    } as any;

    const result = scoreEvaluation(evaluation);
    expect(result.decision).toBe(Decision.LEARN_FIRST);
  });
});
