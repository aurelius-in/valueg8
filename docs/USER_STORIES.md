# User Stories — ValueG8 (ValueGate)

Primary persona: AI Strategist / Portfolio Lead (e.g., John Wantz Jr.)

Epic: Triage and prioritize AI initiatives

US-001
As an AI Strategist I want to enter a proposed initiative and capture the current workflow baseline so I can understand whether AI would materially change outcomes and who owns the process.

US-002
As an AI Strategist I want to add observed and assumed evidence items with sources and confidence so I can quantify evidence strength and show what is actually measured.

US-003
As an Enterprise Architect I want the app to flag data blockers and deployment constraints so I can advise whether the initiative is feasible within my governance model.

US-004
As a CIO I want to see a one-page decision memo I can print for the governance board so I can document why we approved or deferred a pilot.

US-005
As a Program Owner I want to export an evaluation (JSON) to share with engineering so they can implement a pilot with the exact inputs we validated.

US-006
As a Portfolio Lead I want to compare 2–5 initiatives by readiness, evidence strength, and modeled value so I can allocate scarce engineering capacity to the most promising items.

US-007
As a Compliance Officer I want the control readiness table and audit coverage clearly visible so I can approve a pilot that meets regulatory needs.

US-008
As a Workshop Facilitator I want a sample evaluation (Claims Support Copilot) that I can use to demo the tool immediately during discovery calls.

Adjacencies / Secondary personas
- Procurement: use decision memo to assess vendor proposals
- M&A diligence: capture observed evidence and data sensitivity when evaluating target capabilities
- Internal governance board: standardized decision record for audit

Acceptance criteria (examples)
- Autosave must persist all fields to localStorage within 2 seconds of change
- Import/export JSON roundtrips without data loss
- Decision must be deterministic and reproducible from the same inputs
- Printable memo renders correctly to PDF
