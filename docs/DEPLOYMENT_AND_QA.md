# Deployment & QA Guidance

Local development
- node >= 20
- pnpm or npm
Commands
- Install dependencies: npm install
- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint
- Test: npm test (Vitest)

Vercel deployment
- Recommended project name: valuegate
- Connect the GitHub repo aurelius-in/valueg8
- Use framework: Next.js (detect automatically)
- Build command: npm run build
- Output directory: (Next.js handles via build)
- Environment: none required for MVP (no backend)

QA checklist (before release)
- Run: npm run build (must succeed)
- Run tests: npm test (all tests pass)
- Manual checks:
  - Create a new evaluation and fill partial data, refresh browser, confirm persistence
  - Export / import roundtrip
  - Print memo to PDF
  - Compare two sample initiatives
  - Confirm no form data leaves the browser

Suggested Vercel settings
- Enforce HTTPS
- Set build caches for Next.js

Files added in this commit
- docs/*.md (architecture docs and guidance)
