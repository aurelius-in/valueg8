# ValueG8 (ValueGate) — Architecture Overview

This repository contains the ValueG8 (ValueGate) MVP: an evidence-backed decision gate for enterprise AI initiatives.

This document summarizes the architecture and rationale for the MVP and for the broader product direction requested by the stakeholder (John Wantz Jr. and colleagues). It maps product capabilities to RM-ODP viewpoints and outlines user stories, core features, non-functional requirements, data model notes, component structure, and deployment guidance.

Goals
- Provide a deterministic, inspectable decision engine that never fabricates evidence.
- Support enterprise AI strategists, architects, CIOs, consultants, and program leads in deciding whether an initiative should consume implementation resources.
- Keep all evaluation data private by default and stored locally (localStorage). No external AI services or analytics.

What I added in this commit
- Detailed architecture documents (RM-ODP viewpoints, user stories, features, component map)
- Branding and UI guidance to match supplied logos and the product brief
- Deployment and QA guidance so the app can be deployed to Vercel

Next: scaffold the Next.js TypeScript app, add core libraries (Tailwind, shadcn/ui, Zod), and implement the deterministic scoring engine in lib/scoring.ts.
