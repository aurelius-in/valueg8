# RM-ODP Mapping for ValueG8 (ValueGate)

This document maps ValueG8 to the RM-ODP viewpoints: Enterprise, Information, Computational, Engineering, and Technology. The mapping shows how the product's requirements and architecture align with the standard enterprise architecture viewpoints and provides a clear audit trail for reviewers.

1. Enterprise View (Purpose, Policies, Stakeholders)

Purpose
- Provide a defensible gate that determines whether an AI initiative is READY_TO_PILOT, LEARN_FIRST, or DO_NOT_PRIORITIZE.
- Surface explicit evidence, assumptions, blockers, and a deterministic decision trace that decision-makers can rely on during prioritization and budget allocation.

Stakeholders
- AI Strategist / Portfolio Lead (primary)
- Enterprise Architect
- CIO / IT Leadership
- Program Manager / Operational Owner
- Data Owners and Model Governance
- Compliance and Risk Officers
- Implementation Engineering Leads

Policies and Constraints
- Privacy-first: no external transmission of evaluation contents by default.
- Deterministic scoring: no LLMs or generative AI for automated scoring.
- Transparent traceability: every recommendation links to explicit inputs or evidence items.
- Local persistence: evaluations are stored in localStorage; users can import/export JSON manually to share.

Use cases (high level)
- Rapidly triage discovery ideas during a client workshop.
- Prepare a short memo for an investment/governance review board.
- Compare several initiatives to inform resource allocation.

2. Information View (Data, Evidence Model, Formats)

Data models (high level)
- Evaluation: metadata (id, title, org, owner, status, lastUpdated)
- EvidenceItem: claim, type (OBSERVED, SPONSOR_REPORTED, ASSUMED), source, date, confidence, notes
- DataSource: name, owner, access_status, quality, sensitivity, freshness, ground_truth
- ValueMechanism: mechanism type, baseline, expected_change, unit, annual_value_range, evidence_type
- CostInputs: one-time items, annual recurring items, contingency
- DeploymentInputs: allowed modes, restrictions, costs
- ControlInputs: approval model, audit coverage, failure impact, governance owners

Persistence
- localStorage with versioned keys: valueg8:v1:evaluations
- Import/Export JSON for sharing or archival (user-initiated)

Privacy
- No telemetry capturing evaluation contents
- Option to export sanitized memo (remove identifying metadata)

3. Computational View (Components, Interfaces, Decision Engine)

Main components
- UI layer (Next.js app routes + React components)
- Form/Wizard orchestration (autosave, validation, progression)
- Evidence Ledger component
- Scoring engine (lib/scoring.ts) — deterministic, unit-tested
- Economics module (lib/economics.ts) — deterministic cost/value calculations
- Decision-engine (lib/decision-engine.ts) — applies weights, hard gates, and produces DecisionResult
- Storage module (lib/storage.ts) — versioned localStorage wrapper, import/export
- Memo generator (route -> printable /evaluation/[id]/memo)

Interfaces
- UI <-> Storage: synchronous API with optimistic persistence and version migration
- UI <-> Scoring: scoring inputs -> per-dimension score + explanations
- Export/Import JSON API (client-side only)

4. Engineering View (Deployment, Distribution, Availability)

Single-page app deployed to Vercel (Next.js App Router). Static assets and dynamic client code; no server-side persistent store.

Deployment considerations
- Build: npm run build; Vercel auto-build
- Hosting: Vercel static+serverless edge runtime if SSR required for memo printing
- Availability: service depends on Vercel uptime; local data persists in browser

Operational concerns
- No external credentials
- Local migrations on version bump (lib/storage.ts handles migrations)

5. Technology View (Frameworks, Libraries, Hosting)

Recommended stack
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components (for consistent component primitives)
- Lucide icons
- Zod for validation
- Vitest + testing-library for tests
- Recharts only when needed
- Vercel for deployment

Rationale
- Minimal infra, deployable fast, privacy-first architecture, and familiar React/Next.js developer experience.
