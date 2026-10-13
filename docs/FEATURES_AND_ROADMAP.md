# Features, Roadmap, and Prioritization

Core MVP features (must-have)
- Multi-step evaluation wizard (10 steps) with autosave
- Evidence ledger with typed evidence (OBSERVED, SPONSOR-REPORTED, ASSUMED)
- Deterministic scoring engine and visible reasoning per-dimension
- Hard gate logic that overrides numeric score when necessary
- Decision page with top-level decision and reasons
- Printable / PDF-friendly one-page decision memo
- Local import/export JSON
- Sample evaluation "Claims Support Copilot" as SAMPLE DATA
- Portfolio compare page with selectable initiatives and scatter plot
- Tests for scoring and decision logic (Vitest)

Important near-term features (next 1–2 sprints)
- Pilot design generator with fillable template
- Deployment cost scenario visualizer (hosted vs private) when inputs present
- Sensitivity slider for realized benefit % in economics view
- Improved accessibility and keyboard navigation

Longer-term / optional
- Team collaboration via local encrypted file exchange (still no central server)
- Enterprise packaging: self-hosted Vercel/Cloud runbook for organizations that require deployment inside VPC
- Integration adapters for SIEM/GRC (import control/audit events) — manual connectors only, opt-in

Blocking risk and mitigations
- Privacy guarantees: emphasize local data and provide guidance in onboarding
- Browser storage limits: advise export for large evaluations and provide versioning

Roadmap suggestion
- Sprint 0: scaffold app, add core libraries, implement storage and sample page
- Sprint 1: implement wizard UI, evidence ledger, scoring engine and tests
- Sprint 2: implement economics, deployment scenarios, decision page, memo
- Sprint 3: compare view, export/import, printing, polish
