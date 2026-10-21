# State

**Last updated:** 2026-10-21
**Phase:** 1 of the roadmap (general scope and details), planning only

## What exists
- The project docs: `README.md`, `CLAUDE.md`, `AGENTS.md`, `STATE.md`, and `ROADMAP.md`.
- The folder layout: `frontend/`, `backend/`, `data/` (`courses/`, `careers/`), and `docs/` (`research/`, `data-sources/`). Each folder has only a README that explains its purpose.
- No code, data, or git repository yet. Git will be set up by another agent.

## Performance
Nothing to measure yet. This section will track how the product is performing once something is live.

## Decisions log
| Date | Decision |
|---|---|
| 2026-10-21 | Project restarted from scratch. GSU Pathways is light inspiration only |
| 2026-10-21 | Frontend: React, with Vite for development |
| 2026-10-21 | Backend: Python with FastAPI. Database: SQL |
| 2026-10-21 | Launch is browsing only. Sign-in and personal features come later (see roadmap) |
| 2026-10-21 | Course ↔ career logic is its own step, after the general scope and details are finished |
| 2026-10-21 | Hosting: Cloudflare and Vercel proposed. No paid systems until the budget is discussed with faculty |
| 2026-10-21 | Docs: ROADMAP.md replaces a separate PLAN.md. CLAUDE.md holds general context, and AGENTS.md holds short agent rules |

## Open questions
1. **Which SQL database?** One option raised was PostgreSQL, but it's not decided.
2. **Hosting split:** which pieces run on Cloudflare and which on Vercel (frontend, FastAPI backend, database), and what each costs. This waits on the faculty budget talk.
3. **Data sources** to look into. None are chosen or checked yet:
   - WFU courses: the undergraduate bulletin, the CS department site, and syllabi.
   - Careers: O\*NET, BLS (Occupational Outlook Handbook and pay data), and the ACM/IEEE CS2023 curriculum.
   - WFU-specific: Career Office outcomes data and Handshake.
   - Note: LinkedIn and Indeed don't allow scraping.
4. **Course ↔ career logic:** saved for its own roadmap step.
